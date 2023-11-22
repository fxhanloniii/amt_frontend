import { StyleSheet, Text, View, FlatList, Image, TextInput } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-web';


const mockData = {
  Appliances: [
    { name: 'Washer', imageUrl: 'https://example.com/washer.jpg', price: '$200' },
    { name: 'Dryer', imageUrl: 'https://example.com/dryer.jpg', price: '$250' },
    { name: 'Refrigerator', imageUrl: 'https://example.com/refrigerator.jpg', price: '$800' },
    { name: 'Microwave', imageUrl: 'https://example.com/microwave.jpg', price: '$100' },
    { name: 'Oven', imageUrl: 'https://example.com/oven.jpg', price: '$600' },
    { name: 'Dishwasher', imageUrl: 'https://example.com/dishwasher.jpg', price: '$400' },
    { name: 'Blender', imageUrl: 'https://example.com/blender.jpg', price: '$50' },
    { name: 'Toaster', imageUrl: 'https://example.com/toaster.jpg', price: '$30' },
    { name: 'Coffee Maker', imageUrl: 'https://example.com/coffee_maker.jpg', price: '$40' },
    { name: 'Vacuum Cleaner', imageUrl: 'https://example.com/vacuum.jpg', price: '$150' }
  ],
  'Concrete & Brick': [
    { name: 'Cement Bag', imageUrl: 'https://example.com/cement_bag.jpg', price: '$8' },
    { name: 'Red Bricks', imageUrl: 'https://example.com/red_bricks.jpg', price: '$0.50' },
    { name: 'Concrete Mix', imageUrl: 'https://example.com/concrete_mix.jpg', price: '$10' },
    { name: 'Concrete Blocks', imageUrl: 'https://example.com/concrete_blocks.jpg', price: '$1.20' },
    { name: 'Mortar Mix', imageUrl: 'https://example.com/mortar_mix.jpg', price: '$7' },
    { name: 'Patio Stones', imageUrl: 'https://example.com/patio_stones.jpg', price: '$3' },
    { name: 'Pavers', imageUrl: 'https://example.com/pavers.jpg', price: '$2' },
    { name: 'Retaining Wall Blocks', imageUrl: 'https://example.com/retaining_blocks.jpg', price: '$2.50' },
    { name: 'Concrete Sealant', imageUrl: 'https://example.com/sealant.jpg', price: '$12' },
    { name: 'Masonry Trowel', imageUrl: 'https://example.com/trowel.jpg', price: '$15' }
  ],
  Electrical: [
    { name: 'LED Bulb', imageUrl: 'https://example.com/led_bulb.jpg', price: '$5' },
    { name: 'Extension Cord', imageUrl: 'https://example.com/extension_cord.jpg', price: '$10' },
    { name: 'Switch Plate', imageUrl: 'https://example.com/switch_plate.jpg', price: '$3' },
    { name: 'Circuit Breaker', imageUrl: 'https://example.com/circuit_breaker.jpg', price: '$15' },
    { name: 'Wall Outlet', imageUrl: 'https://example.com/wall_outlet.jpg', price: '$4' },
    { name: 'Ceiling Fan', imageUrl: 'https://example.com/ceiling_fan.jpg', price: '$80' },
    { name: 'Surge Protector', imageUrl: 'https://example.com/surge_protector.jpg', price: '$20' },
    { name: 'Dimmer Switch', imageUrl: 'https://example.com/dimmer_switch.jpg', price: '$12' },
    { name: 'Wire Stripper', imageUrl: 'https://example.com/wire_stripper.jpg', price: '$8' },
    { name: 'Voltage Tester', imageUrl: 'https://example.com/voltage_tester.jpg', price: '$7' }
  ],
  Hardware: [
    { name: 'Screw', imageUrl: 'https://example.com/screw.jpg', price: '$0.05' },
    { name: 'Hammer', imageUrl: 'https://example.com/hammer.jpg', price: '$15' },
    { name: 'Nail', imageUrl: 'https://example.com/nail.jpg', price: '$0.03' },
    { name: 'Wrench', imageUrl: 'https://example.com/wrench.jpg', price: '$12' },
    { name: 'Bolt', imageUrl: 'https://example.com/bolt.jpg', price: '$0.10' },
    { name: 'Saw', imageUrl: 'https://example.com/saw.jpg', price: '$20' },
    { name: 'Screwdriver', imageUrl: 'https://example.com/screwdriver.jpg', price: '$8' },
    { name: 'Tape Measure', imageUrl: 'https://example.com/tape_measure.jpg', price: '$7' },
    { name: 'Drill Bit', imageUrl: 'https://example.com/drill_bit.jpg', price: '$5' },
    { name: 'Pliers', imageUrl: 'https://example.com/pliers.jpg', price: '$10' }
  ],
  Lumber: [
    { name: '2x4 Pine', imageUrl: 'https://example.com/2x4_pine.jpg', price: '$5' },
    { name: '2x6 Redwood', imageUrl: 'https://example.com/2x6_redwood.jpg', price: '$7' },
    { name: '4x4 Fir', imageUrl: 'https://example.com/4x4_fir.jpg', price: '$10' },
    { name: 'Plywood Sheet', imageUrl: 'https://example.com/plywood_sheet.jpg', price: '$20' },
    { name: 'Oak Plank', imageUrl: 'https://example.com/oak_plank.jpg', price: '$12' },
    { name: 'Cedar Strip', imageUrl: 'https://example.com/cedar_strip.jpg', price: '$3' },
    { name: 'Lattice Panel', imageUrl: 'https://example.com/lattice_panel.jpg', price: '$15' },
    { name: 'Particle Board', imageUrl: 'https://example.com/particle_board.jpg', price: '$10' },
    { name: 'MDF Board', imageUrl: 'https://example.com/mdf_board.jpg', price: '$8' },
    { name: 'Hardwood Flooring', imageUrl: 'https://example.com/hardwood_flooring.jpg', price: '$50' }
  ],
  Paint: [
    { name: 'White Paint', imageUrl: 'https://example.com/white_paint.jpg', price: '$20' },
    { name: 'Blue Paint', imageUrl: 'https://example.com/blue_paint.jpg', price: '$25' },
    { name: 'Red Paint', imageUrl: 'https://example.com/red_paint.jpg', price: '$25' },
    { name: 'Yellow Paint', imageUrl: 'https://example.com/yellow_paint.jpg', price: '$20' },
    { name: 'Green Paint', imageUrl: 'https://example.com/green_paint.jpg', price: '$24' },
    { name: 'Primer', imageUrl: 'https://example.com/primer.jpg', price: '$18' },
    { name: 'Clear Coat', imageUrl: 'https://example.com/clear_coat.jpg', price: '$22' },
    { name: 'Paint Thinner', imageUrl: 'https://example.com/paint_thinner.jpg', price: '$10' },
    { name: 'Stain', imageUrl: 'https://example.com/stain.jpg', price: '$15' },
    { name: 'Varnish', imageUrl: 'https://example.com/varnish.jpg', price: '$16' }
  ],
  // ... other categories
};

export default function CategoryItems({ route }) {

  const { categoryName } = route.params;
  const items = mockData[categoryName] || [];

  return (
    <View style={styles.container}>
      <TextInput 
        style={styles.searchBar}
        placeholder="What does your project need?" // do we change this?
      />
      <View style={styles.categoryLocationContainer}>
        <Text style={styles.titleCategory}>{categoryName}</Text>
        <Text style={styles.locationInput}>Location</Text>
      </View>
      <View style={styles.horizontalLine} />
      <FlatList 
        data={items}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            
              <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
              <View style={styles.itemDetails}>
              <Text style={styles.itemPrice}>{item.price}</Text>
                <Text style={styles.itemName}>{item.name}</Text>
              </View>
            
          </View>
        )}
        numColumns={2}  // 2 items per row
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2efe9',
    //alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
  },
  searchBar: {
    marginTop: 10,  
    height: 40,
    width: '90%',  
    borderColor: '#d1d1d1',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,  
    paddingRight: 10,
    alignSelf: 'center',
    backgroundColor: 'white', 
  },
  categoryLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    justifyContent: 'space-between',
    width: '90%',
    alignSelf: 'center',
  },
  titleCategory: {
    fontSize: 18, 
    fontWeight: 'bold',
  },
  horizontalLine: {
    height: 1,
    backgroundColor: 'gray',
    width: '90%',
    alignSelf: 'center',
    marginVertical: 10,
  },
  itemContainer: {
    flexDirection: 'column',
    width: '45%',  // 2 items per row
    margin: '2%',
    alignItems: 'center',
  },
  itemImage: {
    width: 165,
    height: 165,
    marginBottom: 8,
    backgroundColor: 'lightgray',
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 5,  
  },
  itemName: {
    fontSize: 12,
    flex: 2,  
  },
  itemPrice: {
    fontSize: 12,
    fontWeight: 'bold',
    flex: 1,  
  },
})