import { useMemo } from "react";
import { View } from "react-native";
import { Chip, Text } from "react-native-paper";
import useMoment from "../hooks/useMoment";
import useSchedule from "../hooks/useSchedule";
import useScheduleService from "../hooks/useScheduleService";

export default function ScheduleEventList({ scheduleId }) {
  const { schedule, loading, error } = useSchedule(scheduleId);
  const { planString, toggleTaken } = useScheduleService();
  const { moment, calendarDayOnlyFormats } = useMoment();

  const groupedSchedules = useMemo(() => {
    if (!schedule) {
      return [];
    }
    const gs = schedule.schedule.reduce((acc, item) => {
      const date = moment(item.date).startOf("day");
      const dateFmt = date.format("yyyy-MM-DD");
      if (!(dateFmt in acc)) {
        acc[dateFmt] = [];
      }
      acc[dateFmt].push(item);
      return acc;
    }, {});

    const ret = [];
    const keys = Object.keys(gs).sort();
    for (let key of keys) {
      const e = {
        day: key,
        times: [...gs[key].sort((a, b) => a.date > b.date)],
      };
      ret.push(e);
    }
    return ret;
  }, [schedule]);

  const handleToggleEvent = async (eventId) => {
    await toggleTaken(schedule.id, eventId);
  }

  return (
    <View>
      {groupedSchedules.map((sch) => (
        <View key={sch.day}>
          <Text variant="titleLarge" style={{ marginTop: 10 }}>
            {moment(sch.day, "yyyy-MM-DD").calendar(
              null,
              calendarDayOnlyFormats
            )}
          </Text>
          <View>
            <View
              style={{ flexDirection: "row", justifyContent: "flex-start" }}
            >
              {sch.times.map((event) => (
                <Chip
                  key={event.id}
                  elevated={true}
                  icon={event.taken ? "check" : ""}
                  style={{ margin: 5 }}
                  onPress={() => handleToggleEvent(event.id)}
                >
                  {moment(event.date).format("HH:mm")}
                </Chip>
              ))}
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}
