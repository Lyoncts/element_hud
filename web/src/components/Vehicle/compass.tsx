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
import { compassStore } from "../../stores/stats";
import {
  settingsStore,
  type CompassHudLayout,
  type CompassPosition,
  type PlayerHudLayout,
} from "../../stores/settings";
import type { CompassStore } from "../../typings/stats";
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

const BOTTOM_PLAYER_HUD_CLEARANCE: Record<PlayerHudLayout, string> = {
  icons: "6.5vh",
  minimal: "7.5vh",
  circular: "6.8vh",
};

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

function getBottomPlayerHudClearance(layout: PlayerHudLayout) {
  return BOTTOM_PLAYER_HUD_CLEARANCE[layout];
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

const getCompassPositionStyle = (
  position: CompassPosition,
  playerLayout: PlayerHudLayout,
  playerPosition: string,
): React.CSSProperties => {
  if (position === "bottom-left") {
    return {
      position: "fixed",
      left: "1vw",
      bottom: "27.5vh",
      top: "auto",
      right: "auto",
      transform: "none",
      zIndex: 999,
      pointerEvents: "none",
    };
  }

  if (position === "top-left") {
    return {
      position: "fixed",
      left: "1vw",
      top: "1.7vh",
      bottom: "auto",
      right: "auto",
      transform: "none",
      zIndex: 999,
      pointerEvents: "none",
    };
  }

  if (position === "bottom-center") {
    const sharesBottom = playerPosition === "bottom-center";
    const bottomOffset = sharesBottom
      ? getBottomPlayerHudClearance(playerLayout)
      : "1.7vh";
    return {
      position: "fixed",
      left: "50%",
      bottom: bottomOffset,
      top: "auto",
      right: "auto",
      transform: "translateX(-50%)",
      zIndex: 999,
      pointerEvents: "none",
    };
  }

  return {
    position: "fixed",
    left: "50%",
    top: "1.7vh",
    bottom: "auto",
    right: "auto",
    transform: "translateX(-50%)",
    zIndex: 999,
    pointerEvents: "none",
  };
};

export const Compass = () => {
  const theme = useMantineTheme();
  const { open, currentStreet, nextStreet, direction, zone, time, weather, temp, wind } =
    compassStore();

  const compassLayout = settingsStore(
    (state) => state.compass.layout,
  ) as CompassHudLayout;

  const compassPosition = settingsStore(
    (state) => state.compass.position,
  ) as CompassPosition;

  const playerLayout = settingsStore(
    (state) => state.player.layout,
  ) as PlayerHudLayout;

  const playerPosition = settingsStore(
    (state) => state.player.position,
  );

  useNuiEvent<Partial<CompassStore>>("UPDATE_COMPASS", (data) => {
    compassStore.setState(data);
  });

  const compactDirection = useMemo(
    () => getCompactDirection(direction),
    [direction],
  );

  const isCompact = compassLayout === "compact";
  const WeatherIconComponent = useMemo(() => getWeatherIcon(weather), [weather]);

  const posStyle = useMemo(
    () =>
      getCompassPositionStyle(compassPosition, playerLayout, playerPosition),
    [compassPosition, playerLayout, playerPosition],
  );

  const transitionType =
    compassPosition === "bottom-left" || compassPosition === "top-left"
      ? "slide-right"
      : compassPosition === "bottom-center"
        ? "slide-up"
        : "slide-down";

  return (
    <Transition
      mounted={open}
      transition={transitionType}
      duration={300}
      timingFunction="ease"
    >
      {(transitionStyles) => (
        <Box
          style={{
            ...posStyle,
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
                minWidth: "16vw",
                maxWidth: "20vw",
                width: "fit-content",
              }}
            >
              {/* Header: Direction Badge + Street & Zone */}
              <Flex align="center" gap="0.8vh">
                <Flex
                  align="center"
                  justify="center"
                  style={{
                    width: "3.8vh",
                    height: "3.8vh",
                    flexShrink: 0,
                    borderRadius: "0.45vh",
                    backgroundColor: "#0084ff",
                    boxShadow: "0 0 10px rgba(0, 132, 255, 0.45)",
                  }}
                >
                  <Text
                    fz="1.55vh"
                    fw={900}
                    c="white"
                    lh={1}
                    tt="uppercase"
                  >
                    {direction || "N"}
                  </Text>
                </Flex>

                <Flex
                  direction="column"
                  gap="0.1vh"
                  style={{ minWidth: 0, flex: 1 }}
                >
                  <Flex align="center" gap="0.4vh">
                    <FaLocationDot
                      size="1.15vh"
                      color="#38bdf8"
                      style={{ flexShrink: 0 }}
                    />
                    <Text
                      fz="1.4vh"
                      fw={900}
                      lh={1.1}
                      tt="uppercase"
                      truncate
                      style={{
                        color: "#38bdf8",
                        textShadow: "0 0 8px rgba(56, 189, 248, 0.4)",
                      }}
                    >
                      {currentStreet || "N/A"}
                    </Text>
                  </Flex>

                  <Text
                    fz="1.1vh"
                    fw={800}
                    c="white"
                    lh={1.1}
                    tt="uppercase"
                    truncate
                    style={{
                      letterSpacing: "0.03em",
                      opacity: 0.95,
                    }}
                  >
                    {zone || "N/A"}
                  </Text>
                </Flex>
              </Flex>

              {/* Info Bar: Time, Weather, Temperature, Wind */}
              <Flex
                align="center"
                justify="space-between"
                gap="0.8vh"
                mt="0.6vh"
                px="0.85vh"
                py="0.5vh"
                style={{
                  borderRadius: "0.45vh",
                  backgroundColor: "rgba(10, 16, 26, 0.85)",
                  backdropFilter: "blur(8px)",
                  border: "0.15vh solid rgba(255, 255, 255, 0.08)",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
                }}
              >
                <Flex align="center" gap="0.35vh">
                  <FaClock size="1.05vh" color="#38bdf8" />
                  <Text fz="1.05vh" fw={800} c="white" lh={1}>
                    {time || "12:00"}
                  </Text>
                </Flex>

                <Flex align="center" gap="0.35vh">
                  <WeatherIconComponent size="1.1vh" color="#38bdf8" />
                  <Text fz="1.05vh" fw={800} c="white" lh={1}>
                    {weather || "Clear"}
                  </Text>
                </Flex>

                <Flex align="center" gap="0.35vh">
                  <FaTemperatureHalf size="1.05vh" color="#38bdf8" />
                  <Text fz="1.05vh" fw={800} c="white" lh={1}>
                    {temp || "72°F"}
                  </Text>
                </Flex>

                <Flex align="center" gap="0.35vh">
                  <FaWind size="1.05vh" color="#38bdf8" />
                  <Text fz="1.05vh" fw={800} c="white" lh={1}>
                    {wind || "0 MPH"}
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          )}
        </Box>
      )}
    </Transition>
  );
};
