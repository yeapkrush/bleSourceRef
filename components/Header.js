import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';

const Header = () => {
	return (
		<View style={styles.sectionContainer}>
			<Image style={styles.logo} source={require('../assets/zp_logo.png')} />
			{/* <Text style={styles.sectionTitle}>Corona Check</Text> */}
		</View>
	);
};

const styles = StyleSheet.create({
	sectionContainer: {
		marginTop: 25,
		paddingHorizontal: 24
	},
	sectionTitle: {
		fontSize: 32,
		fontWeight: '700',
		color: '#707070'
	},
	logo: {
		height: 50,
		width: 68,
		resizeMode: 'contain'
	}
});

export default Header;
