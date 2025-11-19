import { Button, Stack, Typography } from "@mui/material";
import PlayIcon from "@mui/icons-material/PlayArrowRounded";
import PauseIcon from '@mui/icons-material/PauseRounded';
import ResetIcon from "@mui/icons-material/ReplayRounded";
import useToggle from "../../hooks/useToggle";
import { useEffect, useRef, useState, useCallback } from "react";

/**
 * Props for the timer input
 */

interface TimerInputProps {
  value?: string;
  onChange?: (value: string) => void;
}

const parseTime = (timeString: string | undefined): number => {
  if (!timeString || typeof timeString !== "string") {
    return 0;
  }
  if (timeString.includes(":")) {
    const parts = timeString.split(":");
    const minutes = parseInt(parts[0], 10) || 0;
    const seconds = parseFloat(parts[1]) || 0;
    return Math.round((minutes * 60 + seconds) * 10);
  }
  const seconds = parseFloat(timeString) || 0;
  return Math.round(seconds * 10);
};

export default function TimerInput(props: TimerInputProps) {
  const [playing, togglePlaying] = useToggle(false);
  const { value: initialValueString, onChange } = props;
  const initialTimeInTenths = parseTime(initialValueString);
  const [localTime, setLocalTime] = useState(initialTimeInTenths);

  const requestRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const pauseTimeRef = useRef(initialTimeInTenths * 100);

  useEffect(() => {
    if (!playing) {
      const newTimeInTenths = parseTime(initialValueString);
      setLocalTime(newTimeInTenths);
      pauseTimeRef.current = newTimeInTenths * 100;
    }
  }, [initialValueString, playing]);

  const animate = useCallback(() => {
    const elapsed = Date.now() - startTimeRef.current;
    setLocalTime(Math.floor(elapsed / 100));
    requestRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (playing) {
      startTimeRef.current = Date.now() - pauseTimeRef.current;
      requestRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    };
  }, [playing, animate]);

  const handlePlayPause = () => {
    if (playing) {
      if (requestRef.current) {
        const finalTimeMs = Date.now() - startTimeRef.current;
        pauseTimeRef.current = finalTimeMs;
        onChange?.(formatTime(Math.floor(finalTimeMs / 100)));
      }
    }
    togglePlaying();
  };

  const formatTime = (timeInTenths: number) => {
    const totalSeconds = (timeInTenths || 0) / 10;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    if (minutes > 0) {
      return `${minutes}:${seconds.toFixed(1).padStart(4, "0")}`;
    }
    return totalSeconds.toFixed(1);
  };

  const handleReset = () => {
    if (playing) togglePlaying();
    setLocalTime(0);
    pauseTimeRef.current = 0;
    onChange?.(formatTime(0));
  };

  return (
    <Stack direction={"column"} spacing={2} alignItems={"center"}>
      <Typography
        variant="h3" sx={{ minWidth: "180px", textAlign: "center" }}
      >
        {formatTime(localTime)}
      </Typography>
      <Stack direction={"row"} spacing={2}>
        {playing ? (
          <Button variant="outlined" color="secondary" onClick={handlePlayPause}>
            <PauseIcon />
          </Button>
        ) : (
          <Button variant="outlined" color="secondary" onClick={handlePlayPause}>
            <PlayIcon />
          </Button>
        )}
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleReset}
        >
          <ResetIcon />
        </Button>
      </Stack>
    </Stack>
  );
}
