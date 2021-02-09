import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text, FlatList } from 'react-native';
import { Divider } from 'react-native-elements';

const PopUpList = ({ items }) => {
	const renderItem = ({ item }) => {
		return (
			<React.Fragment>
				<View style={styles.item}>
					<Text style={styles.ListItem}>{item.name}</Text>
				</View>
				<Divider style={styles.divider} />
			</React.Fragment>
		);
	};

	return <FlatList data={items} renderItem={renderItem} keyExtractor={(item) => item.id} />;
};

const styles = StyleSheet.create({
	ListItem: {
		marginTop: 5,
		marginLeft: 8,
		fontSize: 22,
		fontWeight: '900',
		color: '#707070'
	},
	item: {
		marginTop: 10,
		marginLeft: 14,
		marginBottom: 10,
		borderLeftWidth: 4,
		borderLeftColor: '#03B69C',
		height: 40
	},
	divider: {
		marginHorizontal: 14
	}
});

export default PopUpList;
