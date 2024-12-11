import { AntDesign, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import React from 'react';


export const icons = {
    Home: (props) => <AntDesign name="home" size={26} {...props} />,
    Activity: (props) => <Ionicons name="stats-chart" size={26} {...props} />,  // Activity icon
    Run: (props) => <MaterialCommunityIcons name="run-fast" size={26} {...props} />,      // You can use "star" as a placeholder
    Profile: (props) => <AntDesign name="user" size={26} {...props} />,
};
