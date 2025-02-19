import { AntDesign, MaterialCommunityIcons, Ionicons, Fontisto } from "@expo/vector-icons";
import React from 'react';



export const icons = {
    Home: (props) => <Fontisto name="info" size={26} {...props} />,
    Activity: (props) => <Ionicons name="stats-chart" size={26} {...props} />,
    Run: (props) => <MaterialCommunityIcons name="run-fast" size={26} {...props} />,
    Profile: (props) => <AntDesign name="user" size={26} {...props} />,
    Challenge: (props) =>  <MaterialCommunityIcons name="run-fast"  size={26} {...props} />, // Adding the Challenge icon
};
