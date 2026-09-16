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
            left: "0.9vw",
            bottom: "6.05vh",
            zIndex: 999,
            pointerEvents: "none",
            backgroundColor: "transparent",
            ...transitionStyles,
          }}
        >
          <Flex
            direction="column"
            style={{
              width: "26.2vh",
              backgroundColor: "transparent",
            }}
          >
            {/* Floating Header: [ NW ] 📍 ELGIN AVE / PILLBOX HILL */}
            <Flex align="center" gap="0.6vh" mb="0.6vh">
              {/* [ NW ] Badge */}
              <Flex
                align="center"
                justify="center"
                style={{
                  width: "3.2vh",
                  height: "3.2vh",
                  flexShrink: 0,
                  borderRadius: "0.35vh",
                  backgroundColor: "#0c192c",
                  border: "0.18vh solid #1e3a5f",
                  boxShadow: "0 0 10px rgba(56, 189, 248, 0.25)",
                }}
              >
                <Text
                  fz="1.35vh"
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
                <Flex align="center" gap="0.35vh">
                  <FaLocationDot
                    size="1.1vh"
                    color="#38bdf8"
                    style={{ flexShrink: 0 }}
                  />
                  <Text
                    fz="1.35vh"
                    fw={900}
                    lh={1.1}
                    tt="uppercase"
                    truncate
                    style={{
                      color: "#38bdf8",
                      letterSpacing: "0.06em",
                      textShadow: "0 0 8px rgba(56, 189, 248, 0.5)",
                    }}
                  >
                    {currentStreet || "ELGIN AVE"}
                  </Text>
                </Flex>

                <Text
                  fz="1.05vh"
                  fw={800}
                  c="white"
                  lh={1.1}
                  tt="uppercase"
                  truncate
                  style={{
                    letterSpacing: "0.04em",
                    paddingLeft: "0.15vh",
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
                px="0.5vh"
                py="0.55vh"
                style={{
                  backgroundColor: "rgba(11, 18, 30, 0.96)",
                  border: "0.22vh solid #1e293b",
                  borderBottom: "0.18vh solid #1e293b",
                  borderRadius: "0.45vh 0.45vh 0 0",
                  whiteSpace: "nowrap",
                }}
              >
                {/* 1. Time */}
                <Flex
                  align="center"
                  justify="center"
                  gap="0.35vh"
                  style={{ flex: 1, minWidth: 0, padding: "0 0.3vh" }}
                >
                  <FaClock size="1.05vh" color="#38bdf8" style={{ flexShrink: 0 }} />
                  <Text fz="0.95vh" fw={700} c="#f8fafc" lh={1} style={{ letterSpacing: "0.02em" }}>
                    {time || "21:59"}
                  </Text>
                </Flex>

                {/* Divider */}
                <Box
                  style={{
                    width: "1px",
                    height: "1.4vh",
                    backgroundColor: "rgba(148, 163, 184, 0.25)",
                    flexShrink: 0,
                  }}
                />

                {/* 2. Weather */}
                <Flex
                  align="center"
                  justify="center"
                  gap="0.35vh"
                  style={{ flex: 1.35, minWidth: 0, padding: "0 0.3vh" }}
                >
                  <WeatherIconComponent size="1.1vh" color="#38bdf8" style={{ flexShrink: 0 }} />
                  <Text fz="0.95vh" fw={700} c="#f8fafc" lh={1} truncate style={{ letterSpacing: "0.02em" }}>
                    {weather || "Rain"}
                  </Text>
                </Flex>

                {/* Divider */}
                <Box
                  style={{
                    width: "1px",
                    height: "1.4vh",
                    backgroundColor: "rgba(148, 163, 184, 0.25)",
                    flexShrink: 0,
                  }}
                />

                {/* 3. Temperature */}
                <Flex
                  align="center"
                  justify="center"
                  gap="0.35vh"
                  style={{ flex: 1, minWidth: 0, padding: "0 0.3vh" }}
                >
                  <FaTemperatureHalf size="1.05vh" color="#38bdf8" style={{ flexShrink: 0 }} />
                  <Text fz="0.95vh" fw={700} c="#f8fafc" lh={1} style={{ letterSpacing: "0.02em" }}>
                    {temp || "72°F"}
                  </Text>
                </Flex>

                {/* Divider */}
                <Box
                  style={{
                    width: "1px",
                    height: "1.4vh",
                    backgroundColor: "rgba(148, 163, 184, 0.25)",
                    flexShrink: 0,
                  }}
                />

                {/* 4. Wind / Speed */}
                <Flex
                  align="center"
                  justify="center"
                  gap="0.35vh"
                  style={{ flex: 1.25, minWidth: 0, padding: "0 0.3vh" }}
                >
                  <FaWind size="1.05vh" color="#38bdf8" style={{ flexShrink: 0 }} />
                  <Text fz="0.95vh" fw={700} c="#f8fafc" lh={1} style={{ letterSpacing: "0.02em" }}>
                    {wind || "N 0 MPH"}
                  </Text>
                </Flex>
              </Flex>

              {/* Minimap Frame (Transparent Cutout for GTA Minimap) */}
              <Box
                style={{
                  width: "100%",
                  height: "19.6vh",
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
