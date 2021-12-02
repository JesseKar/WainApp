import React, { useEffect, useState } from 'react';
import RadioButtonGroup, { RadioButtonItem } from 'expo-radio-button';
import { View, Text, Modal, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { API_URL } from "@env"

const BASE_URL = API_URL
const COUNTRY_URL = 'country/'
const TYPE_URL = 'type/'
const TYPE_COUNTRY_URL = 'type&country/'

export const SearchFilter = (props) => {
    const {
        isFilterVisible,
        isType, setType,
        toggleModal,
        selectedCountry, setSelectedCountry,
        isUrl, setUrl } = props;

    var countries = [
        'None', 'Argentiina', 'Australia', 'Bolivia', 'Bulgaria', 'Chile',
        'Englanti', 'Espanja', 'Etelä-Afrikka', 'Georgia', 'Intia',
        'Israel', 'Italia', 'Itävalta', 'Japani', 'Kanada', 'Kiina',
        'Kreikka', 'Kroatia', 'Kypros', 'Libanon', 'Luxemburg', 'Meksiko',
        'Moldova', 'Montenegro', 'Peru', 'Pohjois-Makedonia', 'Portugali',
        'Ranska', 'Romania', 'Ruotsi', 'Saksa', 'Serbia', 'Slovakia',
        'Slovenia', 'Sveitsi', 'Tsekki', 'Turkki', 'Unkari', 'Uruguay',
        'Uusi-Seelanti', 'Venäjä', 'Yhdysvallat', 'Muu alkuperämaa'
    ]

    const setUpUrl = () => {
        if (selectedCountry === 'None' && isType === 'all') {
            setUrl(BASE_URL)
        }
        else if (selectedCountry !== 'None' && isType !== 'all') {
            setUrl(`${BASE_URL}${TYPE_COUNTRY_URL}${isType}/${selectedCountry}`)
        }
        else if (selectedCountry === 'None' && isType !== 'all') {
            setUrl(`${BASE_URL}${TYPE_URL}${isType}`)
        }
        else if (selectedCountry !== 'None' && isType === 'all') {
            setUrl(`${BASE_URL}${COUNTRY_URL}${selectedCountry}`)
        }
    }

    useEffect(() => {
        setUpUrl()
    }, [isType, selectedCountry])

    return (
        <Modal animationType='slide' visible={isFilterVisible} >
            <View >
                <Text>Filter</Text>
                <View>
                    <RadioButtonGroup
                        containerStyle={{ marginBottom: 10 }}
                        selected={isType}
                        onSelected={(value) => setType(value)}
                        radioBackground='black'>
                        <RadioButtonItem value='all' label='Kaikki' />
                        <RadioButtonItem value='white' label='Valkoviini' />
                        <RadioButtonItem value='rose' label='Roseeviini' />
                        <RadioButtonItem value='red' label='Punaviini' />
                    </RadioButtonGroup>
                </View>

                <Picker

                    mode='dropdown'
                    selectedValue={selectedCountry}
                    onValueChange={(itemValue, itemIndex) => {
                        setSelectedCountry(itemValue)
                    }}>
                    {countries.map((item, index) => {
                        return (
                            <Picker.Item label={item} value={item} key={index} />
                        )
                    })}

                </Picker>

                <Button title="Ready" onPress={toggleModal} />
            </View>
        </Modal>
    )

}

/* CHECKBOX VAIHTOEHTO FILTTERIIN
                    <View>
                        <Checkbox
                            value={isRed}
                            onValueChange={setRed}
                            color={isRed ? '#4630EB' : undefined}
                        />
                        <Text>Red</Text>
                    </View>
                    <View >
                        <Checkbox
                            value={isRose}
                            onValueChange={setRose}
                            color={isRose ? '#4630EB' : undefined}
                        />
                        <Text>Rose</Text>
                    </View>
                    <View>
                        <Checkbox
                            value={isWhite}
                            onValueChange={setWhite}
                            color={isWhite ? '#4630EB' : undefined}
                        />
                        <Text>White</Text>
                    </View> */