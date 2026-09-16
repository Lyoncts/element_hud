import {
  Box,
  Flex,
  Text,
  Transition,
  useMantineTheme,
} from "@mantine/core";
import { useMemo } from "react";
import { useNuiEvent } from "../../hooks/useNuiEvent";
import { compassStore, minimapStore } from "../../stores/stats";
import type { CompassStore } from "../../typings/stats";
import { isEnvBrowser } from "../../utils/misc";
import {
  FaClock,
  FaCloud,
  FaCloudBolt,
  FaCloudRain,
  FaCloudSun,
  FaLocationDot,
  FaSmog,
  FaSnowflake,
  FaSun,
  FaTemperatureHalf,
  FaWind,
} from "react-icons/fa6";

const getWeatherIcon = (weather?: string) => {
  const w = (weather || "").toLowerCase();
  if (w.includes("rain") || w.includes("drizzle")) return FaCloudRain;
  if (w.includes("thunder")) return FaCloudBolt;
  if (w.includes("snow") || w.includes("blizzard")) return FaSnowflake;
  if (w.includes("fog") || w.includes("smog")) return FaSmog;
  if (w.includes("cloud") || w.includes("overcast")) return FaCloud;
  if (w.includes("clear") || w.includes("extra")) return FaSun;
  return FaCloudSun;
};

export const Compass = () => {
  const theme = useMantineTheme();
  const { open, currentStreet, direction, zone, time, weather, temp, wind } =
    compassStore();
  const { visibility: minimapVisible } = minimapStore();

  useNuiEvent<Partial<CompassStore>>("UPDATE_COMPASS", (data) => {
    compassStore.setState(data);
  });

  useNuiEvent("MINIMAP_SHOW", () => {
    minimapStore.setState({ visibility: true });
  });

  useNuiEvent("MINIMAP_HIDE", () => {
    minimapStore.setState({ visibility: false });
  });

  const WeatherIconComponent = useMemo(() => getWeatherIcon(weather), [weather]);

  const isVisible = open || (isEnvBrowser() && minimapVisible);

  return (
    <Transition
      mounted={isVisible}
      transition="slide-right"
      duration={300}
      timingFunction="ease"
    >
      {(transitionStyles) => (
        <Box
          style={{
            position: "fixed",
            left: "1vw",
            bottom: "5.6vh",
            zIndex: 999,
            pointerEvents: "none",
            backgroundColor: "transparent",
            ...transitionStyles,
          }}
        >
          <Flex
            direction="column"
            style={{
              width: "30.4vh",
              backgroundColor: "transparent",
            }}
          >
            {/* Floating Header: [ NW ] 📍 ELGIN AVE / PILLBOX HILL */}
            <Flex align="center" gap="0.75vh" mb="0.75vh">
              {/* [ NW ] Badge */}
              <Flex
                align="center"
                justify="center"
                style={{
                  width: "3.5vh",
                  height: "3.5vh",
                  flexShrink: 0,
                  borderRadius: "0.35vh",
                  backgroundColor: "#0c192c",
                  border: "0.18vh solid #1e3a5f",
                  boxShadow: "0 0 10px rgba(56, 189, 248, 0.25)",
                }}
              >
                <Text
                  fz="1.45vh"
                  fw={900}
                  lh={1}
                  tt="uppercase"
                  style={{
                    color: "#67e8f9",
                    textShadow: "0 0 8px rgba(56, 189, 248, 0.75)",
                  }}
                >
                  {direction || "NW"}
                </Text>
              </Flex>

              {/* Street & Zone */}
              <Flex direction="column" gap="0.1vh" style={{ minWidth: 0, flex: 1 }}>
                <Flex align="center" gap="0.45vh">
                  <FaLocationDot
                    size="1.2vh"
                    color="#38bdf8"
                    style={{ flexShrink: 0 }}
                  />
                  <Text
                    fz="1.45vh"
                    fw={900}
                    lh={1.1}
                    tt="uppercase"
                    truncate
                    style={{
                      color: "#38bdf8",
                      letterSpacing: "0.07em",
                      textShadow: "0 0 8px rgba(56, 189, 248, 0.5)",
                    }}
                  >
                    {currentStreet || "ELGIN AVE"}
                  </Text>
                </Flex>

                <Text
                  fz="1.15vh"
                  fw={800}
                  c="white"
                  lh={1.1}
                  tt="uppercase"
                  truncate
                  style={{
                    letterSpacing: "0.05em",
                    paddingLeft: "0.2vh",
                  }}
                >
                  {zone || "PILLBOX HILL"}
                </Text>
              </Flex>
            </Flex>

            {/* The Unified Minimap Frame Box */}
            <Box
              style={{
                width: "100%",
                backgroundColor: "transparent",
                boxShadow: "0 6px 18px rgba(0, 0, 0, 0.65)",
              }}
            >
              {/* Info Bar Header */}
              <Flex
                align="center"
                justify="space-between"
                gap="0.6vh"
                px="0.8vh"
                py="0.6vh"
                style={{
                  backgroundColor: "rgba(11, 18, 30, 0.96)",
                  border: "0.22vh solid #1e293b",
                  borderBottom: "0.18vh solid #1e293b",
                  borderRadius: "0.45vh 0.45vh 0 0",
                }}
              >
                {/* Time */}
                <Flex align="center" gap="0.35vh">
                  <FaClock size="1.1vh" color="#38bdf8" />
                  <Text fz="1.1vh" fw={800} c="white" lh={1}>
                    {time || "21:59"}
                  </Text>
                </Flex>

                {/* Weather */}
                <Flex align="center" gap="0.35vh">
                  <WeatherIconComponent size="1.15vh" color="#38bdf8" />
                  <Text fz="1.1vh" fw={800} c="white" lh={1}>
                    {weather || "Rain"}
                  </Text>
                </Flex>

                {/* Temperature */}
                <Flex align="center" gap="0.35vh">
                  <FaTemperatureHalf size="1.1vh" color="#38bdf8" />
                  <Text fz="1.1vh" fw={800} c="white" lh={1}>
                    {temp || "72°F"}
                  </Text>
                </Flex>

                {/* Wind / Speed */}
                <Flex align="center" gap="0.35vh">
                  <FaWind size="1.1vh" color="#38bdf8" />
                  <Text fz="1.1vh" fw={800} c="white" lh={1}>
                    {wind || "N 0 MPH"}
                  </Text>
                </Flex>
              </Flex>

              {/* Minimap Frame (Transparent Cutout for GTA Minimap) */}
              <Box
                style={{
                  width: "100%",
                  height: "21.4vh",
                  position: "relative",
                  backgroundColor: "transparent",
                  borderLeft: "0.22vh solid #1e293b",
                  borderRight: "0.22vh solid #1e293b",
                  borderBottom: "0.22vh solid #1e293b",
                  borderRadius: "0 0 0.45vh 0.45vh",
                  backgroundImage: isEnvBrowser()
                    ? "url('https://i.imgur.com/kiK65kg.jpeg')"
                    : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "left bottom",
                }}
              />
            </Box>
          </Flex>
        </Box>
      )}
    </Transition>
  );
};
