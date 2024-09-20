import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import { format, subDays, parseISO } from 'date-fns'

const DateCarousel = ({ onDateSelect }) => {
  const [dates, setDates] = useState([])
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), 'yyyy-MM-dd')
  )

  useEffect(() => {
    const today = new Date()
    const datesArray = []

    for (let i = 0; i < 30; i++) {
      datesArray.push(format(subDays(today, i), 'yyyy-MM-dd'))
    }
    setDates(datesArray)
  }, [])

  const handleDateSelect = date => {
    setSelectedDate(date)
    onDateSelect(date)
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
              {format(parseISO(item), 'MMM dd')}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle="px-2"
        inverted
      />
    </View>
  )
}

export default DateCarousel
