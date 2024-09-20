import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import { format, subDays } from 'date-fns'

const DateCarousel = ({ onDateSelect }) => {
  const [dates, setDates] = useState([])
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), 'yyyy-MM-dd')
  )

  // Generate dates for the past 30 days
  useEffect(() => {
    const today = new Date()
    const datesArray = []
    console.log('today:', today)
    // Include today and 29 days before it
    for (let i = 0; i < 30; i++) {
      datesArray.push(format(subDays(today, i), 'yyyy-MM-dd'))
    }

    setDates(datesArray)
  }, [])

  // Handle date selection
  const handleDateSelect = date => {
    setSelectedDate(date)
    onDateSelect(date) // Pass the selected date to parent (HomeScreen)
  }

  return (
    <View>
      <FlatList
        horizontal
        data={dates}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleDateSelect(item)}
            className={`p-2 m-1 rounded ${
              item === selectedDate ? 'bg-blue-500' : 'bg-gray-200'
            }`}
          >
            <Text className="text-center">
              {format(new Date(item), 'MMM dd')}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}
        inverted // This makes the scroll start from the right, where the current date is
      />
    </View>
  )
}

export default DateCarousel
