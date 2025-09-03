import React from "react";
import { Platform } from "react-native";

const NativeDateTimePicker =
  Platform.OS !== "web"
    ? require("@react-native-community/datetimepicker").default
    : null;

type Props = {
  mode: "date" | "time";
  value: Date;
  onChange: (event: any, date?: Date) => void;
  style?: any;
};

export default function DatePicker({ mode, value, onChange, style }: Props) {
  if (Platform.OS === "web") {
    if (mode === "date") {
      return (
        <input
          type="date"
          value={value.toISOString().split("T")[0]}
          onChange={(e) => onChange(null, new Date(e.target.value))}
          style={{ padding: 8, borderRadius: 8, border: "1px solid #ccc", ...style }}
        />
      );
    }
    return (
      <input
        type="time"
        value={value.toTimeString().slice(0, 5)}
        onChange={(e) => {
          const [hours, minutes] = e.target.value.split(":").map(Number);
          const newDate = new Date(value);
          newDate.setHours(hours);
          newDate.setMinutes(minutes);
          onChange(null, newDate);
        }}
        style={{ padding: 8, borderRadius: 8, border: "1px solid #ccc", ...style }}
      />
    );
  }

  return (
    <NativeDateTimePicker
      value={value}
      mode={mode}
      display={Platform.OS === "ios" ? "spinner" : "default"}
      onChange={onChange}
      style={style}
    />
  );
}
