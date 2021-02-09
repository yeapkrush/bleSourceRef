import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { Divider } from 'react-native-elements';
import { BoxShadow } from 'react-native-shadow';

import PopUpList from './PopUpList';

const shadowOpt = {
	width: 330,
	height: 410,
	color: '#3ED2A2',
	border: 19,
	radius: 15,
	opacity: 0.1,
	x: 0,
	y: 18,
	style: { marginVertical: 5 }
};

const PopUpCard = ({ title, mode, data }) => {
	const ListArray = [
		{ name: 'ZP-Covid', id: '1' },
		{ name: 'AmazeFit', id: '2' },
		{ name: 'FoodSense', id: '3' },
		{ name: 'OnePlus', id: '4' },
		{ name: 'OnePlus', id: '5' },
		{ name: 'OnePlus', id: '6' }
	];
	let content;
	if (mode == 'list') {
		content = <PopUpList items={data} />;
	}

	return (
		<BoxShadow setting={shadowOpt}>
			<View style={styles.popInfo}>
				<View style={styles.centerItems}>
					<Text style={styles.popupTitle}>{title}</Text>
				</View>
				{content}
			</View>
		</BoxShadow>
	);
};

const styles = StyleSheet.create({
	popupTitle: {
		marginTop: 8,
		marginBottom: 4,
		fontSize: 22,
		fontWeight: '700',
		color: '#707070'
	},
	popInfo: {
		marginHorizontal: -12,
		width: 350,
		height: 410,
		backgroundColor: 'white',
		borderRadius: 20.5,
		marginTop: 10
	},
	centerItems: {
		marginHorizontal: 95
	},
	itemsBody: {
		//height: 330
	}
});

export default PopUpCard;
