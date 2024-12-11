import React, { useState } from "react";
import { View } from "react-native";
import { Box, Button, ButtonText } from "@gluestack-ui/themed";
import { CartesianChart, Bar, useChartPressState } from "victory-native";
import { Circle } from "@shopify/react-native-skia";
import { LinearGradient, Text as SKText } from "@shopify/react-native-skia";
import { useColorScheme } from "react-native";
import { useDerivedValue } from "react-native-reanimated";

const DATA = () =>
  [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
  ].map((day, index) => ({
    day,
    listenCount: Math.floor(Math.random() * (100 - 50 + 1)) + 50,
  }));

export const ActivityChart = () => {
  const [data, setData] = useState(DATA);
  const colorMode = useColorScheme();
  const { state, isActive } = useChartPressState({
    x: 0,
    y: { listenCount: 0 },
  });

  const isDark = colorMode === "dark";

  const value = useDerivedValue(() => {
    return "$" + state.y.listenCount.value.value;
  }, [state]);

  const textYPosition = useDerivedValue(() => {
    return state.y.listenCount.position.value - 15;
  }, [value]);

  const textXPosition = useDerivedValue(() => {
    return state.x.position.value; // Centering the tooltip text
  }, [value]);

  return (
    <Box
      $dark-bg="$black"
      $light-bg="$white"
      flex={1}
      paddingHorizontal={5}
      paddingVertical={30}
    >
      <Box paddingTop={10} width="95%" height="80%">
        <CartesianChart
          xKey="day"
          padding={5}
          yKeys={["listenCount"]}
          domain={{ y: [0, 100] }}
          domainPadding={{ left: 50, right: 50, top: 30 }}
          axisOptions={{
            tickCount: 5,
            formatXLabel: (value) => value, // Display day names directly
            lineColor: isDark ? "#71717a" : "#d4d4d8",
            labelColor: isDark ? "white" : "black",
          }}
          chartPressState={state}
          data={data}
        >
          {({ points, chartBounds }) => {
            return (
              <>
                <Bar
                  points={points.listenCount}
                  chartBounds={chartBounds}
                  animate={{ type: "timing", duration: 1000 }}
                  roundedCorners={{
                    topLeft: 10,
                    topRight: 10,
                  }}
                >
                  <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    colors={["#0000FF", "#0000FF70"]} // Blue with 70% transparency
                  />
                </Bar>

                {isActive ? (
                  <>
                    <SKText
                      fontSize={24} // Default font size
                      color={isDark ? "white" : "black"}
                      x={textXPosition}
                      y={textYPosition}
                      text={value}
                    />
                    <Circle
                      cx={state.x.position}
                      cy={state.y.listenCount.position}
                      r={8}
                      color={"grey"}
                      opacity={0.8}
                    />
                  </>
                ) : null}
              </>
            );
          }}
        </CartesianChart>
      </Box>
      <Box paddingTop={30} width="95%" height="20%" alignItems="center">
        <Button
          onPress={() => {
            setData(DATA);
          }}
          style={{
            backgroundColor: "#007BFF", // New button background color (Bootstrap blue)
            borderRadius: 25, // Rounded corners
            paddingVertical: 10, // Vertical padding
            paddingHorizontal: 20, // Horizontal padding
            elevation: 3, // Shadow effect
          }}
        >
          <ButtonText size="lg" style={{ color: "white" }}>Update Chart</ButtonText>
        </Button>
      </Box>
    </Box>
  );
};

export default ActivityChart;