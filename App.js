import React, { useState, useEffect } from 'react';
import {
	SafeAreaView,
	StyleSheet,
	TouchableOpacity,
	View,
	Text,
	StatusBar,
	Image,
	Button,
	Animated,
	PermissionsAndroid
} from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import base64 from 'base-64';
import LiquidProgress from 'react-native-liquid-progress';

import Header from './components/Header';
import PopUpCard from './components/PopUpCard';
import { BoxShadow } from 'react-native-shadow';
import Papa from 'papaparse';

const shadowOpt_active = {
	width: 300,
	height: 300,
	color: '#3ED2A2',
	border: 40,
	radius: 150,
	opacity: 0.2,
	x: 0,
	y: 60,
	style: { marginVertical: 5 }
};

const shadowOpt_CancelButton = {
	width: 210,
	height: 70,
	color: '#F44336',
	border: 15,
	radius: 35,
	opacity: 0.05,
	x: 0,
	y: 3,
	style: { marginVertical: 5 }
};

const shadowOpt_Progress = {
	width: 300,
	height: 300,
	color: '#C4FFD6',
	border: 40,
	radius: 150,
	opacity: 0.75,
	x: 0,
	y: 28,
	style: { marginVertical: 5 }
};

const shadowOpt_disabled = {
	width: 300,
	height: 300,
	color: '#CBCBCB',
	border: 40,
	radius: 150,
	opacity: 0.2,
	x: 0,
	y: 60,
	style: { marginVertical: 5 }
};

const requestBLEPermission = async () => {
	try {
		console.log('Request BLE permission');
		const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
			title: 'ZP Covid',
			message: 'ZP Covid requires to enable location ' + 'so you can connect to the device.',
			buttonNeutral: 'Ask Me Later',
			buttonNegative: 'Cancel',
			buttonPositive: 'OK'
		});
		if (granted === PermissionsAndroid.RESULTS.GRANTED) {
			console.log('You can use BLE');
		} else {
			console.log('BLE permission denied');
		}
	} catch (err) {
		console.warn(err);
	}
};

const App = () => {
	const [ BLEdevices, setBLEdevices ] = useState([]);
	const [ progressValue, setProgressValue ] = useState(0);
	const [ connectionBLE, setConnectionBLE ] = useState(1);
	const [ measuring, setMeasuring ] = useState(0);
	let bleManager = new BleManager();
	let count = 0;
	const TransactionId = 'transID';
	let connStatus = 1;
	const BLE_task = { cleanUp: () => {} };
	let hasCalled = 0;

	console.log(BLEdevices);

	const startMeasurement = async () => {
		setMeasuring(1);
		bleManager
			.writeCharacteristicWithResponseForDevice('78:DB:2F:14:0D:1A', 'ffe0', 'ffe1', base64.encode('M'))
			.then((res) => {})
			.catch((err) => {
				console.log('Error');
				console.log(err);
				bleManager.cancelTransaction(TransactionId);
				//bleManager.destroy();
				//bleManager = new BleManager();
				bleManager
					.connectToDevice('78:DB:2F:14:0D:1A', { autoConnect: false })
					.then((device2) => {
						console.log('Discovering services and characteristics');
						return device2.discoverAllServicesAndCharacteristics();
					})
					.then((dev) => {
						return bleManager.writeCharacteristicWithResponseForDevice(
							'78:DB:2F:14:0D:1A',
							'ffe0',
							'ffe1',
							base64.encode('M')
						);
					})
					.then((res) => {
						setConnectionBLE(0);
					})
					.catch((err) => {
						console.log('Error');
						console.log(err);
					});
			});
	};

	const onPressConnect = async () => {
		requestBLEPermission();
		if (connectionBLE == 1) {
			//bleManager.cancelTransaction(TransactionId);
			BLE_task.cleanUp = bleManager
				.connectToDevice('78:DB:2F:14:0D:1A', { autoConnect: false })
				.then((device2) => {
					console.log('Discovering services and characteristics');
					return device2.discoverAllServicesAndCharacteristics();
				})
				.then((device) => {
					if (hasCalled < 2) {
						console.log('hasCalled:', hasCalled);
						hasCalled = 10;
						console.log('hasCalled:', hasCalled);
						device.monitorCharacteristicForService('ffe0', 'ffe1', (err, response) => {
							if (response !== null) {
								const raw = base64.decode(response.value);
								const array = raw.split(',');
								//const data = Papa.parse(data_pre.data[0]);
								if (true) {
									//console.log('sub', count + '  ' + array[0]);
									//console.log('sub', count + ' count' + data.c + ',v:' + data.v + ',c:' + data.c);
								}
								if (parseInt(array[0]) > 0) {
									const percentage = parseFloat((parseInt(array[0], 10) / 417).toFixed(2));
									if (percentage != progressValue) {
										setProgressValue(percentage);
									}
								}
							}
						});
						count++;
					}
					setConnectionBLE(0);
				})
				.catch((err) => {
					console.log('Error');
					console.log(err);
				});
		} else {
			setConnectionBLE(1);
			console.log('Unsubscribing');
			BLE_task.cleanUp();
			//Subscription.unsubscribe().then(() => console.log('Unsubscribed')).catch((error) => console.log(error));
			bleManager.cancelTransaction(TransactionId);

			bleManager
				.cancelDeviceConnection('78:DB:2F:14:0D:1A')
				.then((device) => console.log('Device disconnected'))
				.catch((err) => {
					console.log('Error');
					console.log(err);
				});
			//bleManager.destroy();
			// bleManager = new BleManager();
		}
	};

	return (
		<React.Fragment>
			<StatusBar barStyle="light-content" color="white" />
			<SafeAreaView>
				<View style={styles.body}>
					<Header />
					{connectionBLE === 1 && (
						<TouchableOpacity onPress={onPressConnect} style={styles.sectionContainerConnection}>
							<Image style={styles.Connectionlogo} source={require('./assets/no_connection.png')} />
							<Text style={styles.sectionSmallTextWarning}>Device disconnected</Text>
						</TouchableOpacity>
					)}
					{connectionBLE === 0 && (
						<TouchableOpacity onPress={onPressConnect} style={styles.sectionContainerConnection}>
							<Image style={styles.Connectionlogo} source={require('./assets/connected.png')} />
							<Text style={styles.sectionSmallTextSucess}>Device connected</Text>
						</TouchableOpacity>
					)}
					<View style={styles.centerItemsContainer}>
						{/* <PopUpCard title="Available Devices" mode="list" data={BLEdevices} /> */}
						{connectionBLE === 1 && (
							<BoxShadow setting={shadowOpt_disabled}>
								<TouchableOpacity style={styles.measurementButton}>
									<Image
										style={styles.ActiveMeasurementlogo}
										source={require('./assets/measure_deactive.png')}
									/>
									<Text style={styles.ActiveMeasurementText} />
								</TouchableOpacity>
							</BoxShadow>
						)}
						{connectionBLE === 0 &&
						measuring == 0 && (
							<BoxShadow setting={shadowOpt_active}>
								<TouchableOpacity onPress={startMeasurement} style={styles.measurementButton}>
									<Image
										style={styles.ActiveMeasurementlogo}
										source={require('./assets/measure_active.png')}
									/>
									<Text style={styles.ActiveMeasurementText}> Start Test</Text>
								</TouchableOpacity>
							</BoxShadow>
						)}
						{connectionBLE === 0 &&
						measuring == 1 && (
							<React.Fragment>
								<Text style={styles.textProgressTitle}>Test Stage: PRE</Text>
								<BoxShadow setting={shadowOpt_Progress}>
									<View style={styles.ProgressContainer}>
										<LiquidProgress
											backgroundColor={'white'}
											frontWaveColor={'#31E1C2'}
											backWaveColor={'#C7FBDE'}
											fill={progressValue}
											size={380}
										/>
										<Animated.View style={styles.AnimatedView}>
											<Text style={styles.textProgress}>
												{(progressValue * 100 / 1.2).toFixed(0)}%
											</Text>
										</Animated.View>
									</View>
								</BoxShadow>
							</React.Fragment>
						)}
					</View>

					<View style={styles.footer}>
						{/* {connectionBLE === 0 && (
							<React.Fragment>
								<Image style={styles.Footerlogo} source={require('./assets/info.png')} />
								<View style={styles.footerRight}>
									<Text style={styles.sectionSmallTextNormal}>
										Select the device name to connect to device
									</Text>
								</View>
							</React.Fragment>
						)} */}
						{connectionBLE === 1 && (
							<View style={styles}>
								<Image style={styles.Footerlogo} source={require('./assets/warning.png')} />
								<View style={styles.footerRight}>
									<Text style={styles.sectionSmallTextWarning}>
										Please connect to the device to start the test
									</Text>
								</View>
							</View>
						)}
						{connectionBLE === 0 &&
						measuring === 0 && (
							<React.Fragment>
								<Image style={styles.Footerlogo} source={require('./assets/info.png')} />
								<View style={styles.footerRight}>
									<Text style={styles.sectionSmallTextNormal}>
										Press Start Test to start the measurement
									</Text>
								</View>
							</React.Fragment>
						)}
						{connectionBLE === 0 &&
						measuring === 1 && (
							<BoxShadow setting={shadowOpt_CancelButton}>
								<TouchableOpacity onPress={() => {}} style={styles.CancelButtonTouch}>
									<Image style={styles.Cancellogo} source={require('./assets/cancel.png')} />
									<Text style={styles.CancelText}>Cancel Test</Text>
								</TouchableOpacity>
							</BoxShadow>
						)}
					</View>
				</View>
			</SafeAreaView>
		</React.Fragment>
	);
};

const styles = StyleSheet.create({
	body: {
		//backgroundColor: Colors.white
	},
	sectionSmallTextWarning: {
		fontSize: 16,
		fontWeight: '900',
		color: '#F44336'
	},
	sectionSmallTextSucess: {
		fontSize: 16,
		fontWeight: '900',
		color: '#08B99D'
	},
	ActiveMeasurementText: {
		fontSize: 30,
		fontWeight: '700',
		color: '#13A48D',
		marginHorizontal: 60,
		marginTop: 10
	},
	Connectionlogo: {
		height: 35,
		width: 35,
		resizeMode: 'contain'
	},
	ActiveMeasurementlogo: {
		height: 170,
		width: 170,
		resizeMode: 'contain',
		marginHorizontal: 40,
		marginTop: 40
	},
	sectionContainerConnection: {
		marginTop: 20,
		paddingHorizontal: 24,
		width: 225
	},
	measurementButton: {
		marginTop: 60,
		paddingHorizontal: 24,
		width: 300,
		height: 300,
		borderRadius: 150,
		backgroundColor: 'white'
	},
	centerItemsContainer: {
		marginTop: 50,
		justifyContent: 'center',
		alignItems: 'center'
	},
	footer: {
		marginTop: 200,
		marginHorizontal: 50,
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center'
	},
	footerRight: {
		width: 200
	},
	Footerlogo: {
		height: 35,
		width: 35,
		marginRight: 10,
		resizeMode: 'contain'
	},
	sectionSmallTextNormal: {
		fontSize: 16,
		fontWeight: '900',
		color: '#08B99D'
	},
	ProgressContainer: {
		flex: 1,
		marginTop: 80,
		marginRight: 20,
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'column'
	},
	AnimatedView: {
		alignSelf: 'center',
		justifyContent: 'center',
		alignItems: 'center',
		height: 70
	},
	textProgress: {
		color: '#707070',
		fontSize: 60,
		fontWeight: '700',
		width: 220,
		marginLeft: 145,
		marginBottom: 200
	},
	textProgressTitle: {
		color: '#707070',
		fontSize: 36,
		fontWeight: '800',
		width: 300,
		marginLeft: 90,
		marginTop: 10,
		marginBottom: 40
	},
	CancelButtonTouch: {
		height: 70,
		width: 210,
		backgroundColor: 'white',
		borderRadius: 35,
		flex: 1,
		flexDirection: 'row'
	},
	Cancellogo: {
		height: 40,
		width: 40,
		resizeMode: 'contain',
		marginTop: 14,
		marginLeft: 10
	},
	CancelText: {
		fontSize: 24,
		fontWeight: '700',
		color: '#F44336',
		width: 120,
		marginLeft: 10,
		marginTop: 18
	}
});

export default App;
