import {
  Box,
  Flex,
  Text,
  Transition,
  alpha,
  useMantineTheme,
} from "@mantine/core";
import { useMemo } from "react";
import { useNuiEvent } from "../../hooks/useNuiEvent";
import { compassStore, minimapStore } from "../../stores/stats";
import {
  settingsStore,
  type CompassHudLayout,
} from "../../stores/settings";
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

const COMPASS_DIRECTIONS = [
  "N",
  "NE",
  "E",
  "SE",
  "S",
  "SW",
  "W",
  "NW",
] as const;

type CompassDirection = (typeof COMPASS_DIRECTIONS)[number];

function getCompactDirection(direction?: string) {
  const normalizedDirection = (direction || "N").toUpperCase();
  const index = COMPASS_DIRECTIONS.indexOf(
    normalizedDirection as CompassDirection,
  );

  if (index === -1) {
    return {
      previous: "NW",
      current: normalizedDirection,
      next: "NE",
    };
  }

  return {
    previous:
      COMPASS_DIRECTIONS[
        (index - 1 + COMPASS_DIRECTIONS.length) %
          COMPASS_DIRECTIONS.length
      ],
    current: COMPASS_DIRECTIONS[index],
    next: COMPASS_DIRECTIONS[(index + 1) % COMPASS_DIRECTIONS.length],
  };
}

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
  const { open, currentStreet, nextStreet, direction, zone, time, weather, temp, wind } =
    compassStore();
  const { visibility: minimapVisible } = minimapStore();

  const compassLayout = settingsStore(
    (state) => state.compass.layout,
  ) as CompassHudLayout;

  useNuiEvent<Partial<CompassStore>>("UPDATE_COMPASS", (data) => {
    compassStore.setState(data);
  });

  useNuiEvent("MINIMAP_SHOW", () => {
    minimapStore.setState({ visibility: true });
  });

  useNuiEvent("MINIMAP_HIDE", () => {
    minimapStore.setState({ visibility: false });
  });

  const compactDirection = useMemo(
    () => getCompactDirection(direction),
    [direction],
  );

  const isCompact = compassLayout === "compact";
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
            bottom: "6.5vh",
            zIndex: 999,
            pointerEvents: "none",
            ...transitionStyles,
          }}
        >
          {isCompact ? (
            <Flex
              align="center"
              justify="center"
              gap="1.6vh"
              style={{
                width: "46vh",
              }}
            >
              <Text
                size="1.35vh"
                fw={900}
                ta="right"
                truncate
                style={{
                  width: "14vh",
                  lineHeight: 1,
                  color: "rgba(255, 255, 255, 0.95)",
                  textShadow: "0 0 8px rgba(0, 0, 0, 0.55)",
                  textTransform: "uppercase",
                }}
              >
                {currentStreet || "N/A"}
              </Text>

              <Flex
                align="center"
                justify="center"
                gap="0.7vh"
                px="0.8vh"
                py="0.55vh"
                style={{
                  flexShrink: 0,
                  borderRadius: theme.radius.xs,
                  border: `0.2vh solid ${theme.colors.dark[8]}`,
                  backgroundColor: theme.colors.dark[8],
                  boxShadow: `0 0 10px ${theme.colors.dark[8]}`,
                }}
              >
                <Text size="0.85vh" fw={900} c="gray.5" lh={1}>
                  {compactDirection.previous}
                </Text>

                <Text
                  size="1.55vh"
                  fw={900}
                  lh={1}
                  style={{
                    color: theme.colors.gray[0],
                    textShadow: `0 0 6px ${alpha(
                      theme.colors.gray[0],
                      0.45,
                    )}`,
                  }}
                >
                  {compactDirection.current}
                </Text>

                <Text size="0.85vh" fw={900} c="gray.5" lh={1}>
                  {compactDirection.next}
                </Text>
              </Flex>

              <Text
                size="1.35vh"
                fw={900}
                ta="left"
                truncate
                style={{
                  width: "14vh",
                  lineHeight: 1,
                  color: "rgba(255, 255, 255, 0.95)",
                  textShadow: "0 0 8px rgba(0, 0, 0, 0.55)",
                  textTransform: "uppercase",
                }}
              >
                {nextStreet || ""}
              </Text>
            </Flex>
          ) : (
            <Flex
              direction="column"
              style={{
                width: "16.4vw",
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

              {/* The Card: Info Bar Header + Minimap Frame */}
              <Box
                style={{
                  width: "100%",
                  borderRadius: "0.45vh",
                  overflow: "hidden",
                  border: "0.22vh solid #1e293b",
                  boxShadow: "0 6px 18px rgba(0, 0, 0, 0.65)",
                  backgroundColor: "#0f172a",
                }}
              >
                {/* Info Bar Header */}
                <Flex
                  align="center"
                  justify="space-between"
                  gap="0.8vh"
                  px="0.9vh"
                  py="0.65vh"
                  style={{
                    backgroundColor: "rgba(14, 22, 36, 0.98)",
                    borderBottom: "0.18vh solid #1e293b",
                  }}
                >
                  {/* Time */}
                  <Flex align="center" gap="0.4vh">
                    <FaClock size="1.15vh" color="#38bdf8" />
                    <Text fz="1.15vh" fw={800} c="white" lh={1}>
                      {time || "21:59"}
                    </Text>
                  </Flex>

                  {/* Weather */}
                  <Flex align="center" gap="0.4vh">
                    <WeatherIconComponent size="1.2vh" color="#38bdf8" />
                    <Text fz="1.15vh" fw={800} c="white" lh={1}>
                      {weather || "Rain"}
                    </Text>
                  </Flex>

                  {/* Temperature */}
                  <Flex align="center" gap="0.4vh">
                    <FaTemperatureHalf size="1.15vh" color="#38bdf8" />
                    <Text fz="1.15vh" fw={800} c="white" lh={1}>
                      {temp || "72°F"}
                    </Text>
                  </Flex>

                  {/* Wind / Speed */}
                  <Flex align="center" gap="0.4vh">
                    <FaWind size="1.15vh" color="#38bdf8" />
                    <Text fz="1.15vh" fw={800} c="white" lh={1}>
                      {wind || "N 0 MPH"}
                    </Text>
                  </Flex>
                </Flex>

                {/* Minimap Viewport / Cutout */}
                <Box
                  style={{
                    width: "100%",
                    height: "19vh",
                    position: "relative",
                    backgroundColor: isEnvBrowser() ? "#1e293b" : "transparent",
                    backgroundImage: isEnvBrowser()
                      ? "url('https://i.imgur.com/kiK65kg.jpeg')"
                      : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "left bottom",
                  }}
                />
              </Box>
            </Flex>
          )}
        </Box>
      )}
    </Transition>
  );
};
