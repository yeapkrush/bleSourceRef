import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Image, PermissionsAndroid } from 'react-native';
import base64 from 'base-64';

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

const BLE_ConnectivityButton = ({ connectionBLE, setconnectionBLE }) => {
	const onPressConnect = async () => {
		requestBLEPermission();
		if (connectionBLE == 1) {
			BLE_task.cleanUp = bleManager
				.connectToDevice('78:DB:2F:14:0D:1A', { autoConnect: false })
				.then((device2) => {
					console.log('Discovering services and characteristics');
					return device2.discoverAllServicesAndCharacteristics();
				})
				.then((device) => {
					device.monitorCharacteristicForService('ffe0', 'ffe1', (err, response) => {
						if (response !== null) {
							const raw = base64.decode(response.value);
							const array = raw.split(',');
							if (parseInt(array[0]) > 0) {
								const percentage = parseFloat((parseInt(array[0], 10) / 417).toFixed(2));
								if (percentage != progressValue) {
									setProgressValue(percentage);
								}
							}
						}
					});
					count++;

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
			bleManager.cancelTransaction(TransactionId);

			bleManager
				.cancelDeviceConnection('78:DB:2F:14:0D:1A')
				.then((device) => console.log('Device disconnected'))
				.catch((err) => {
					console.log('Error');
					console.log(err);
				});
		}
	};
	return (
		<React.Fragment>
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
		</React.Fragment>
	);
};

const styles = StyleSheet.create({
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
	Connectionlogo: {
		height: 35,
		width: 35,
		resizeMode: 'contain'
	}
});

export default BLE_ConnectivityButton;
