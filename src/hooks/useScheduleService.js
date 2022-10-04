import { v4 as uuid } from "uuid";
import useMoment from "./useMoment";

import {API_URL} from '@env';
import AsyncStorage from "@react-native-async-storage/async-storage";
import useSchedules from "./useSchedules";

export default function useScheduleService() {
  const {schedules, loading, error, add: addSchedule, refresh: refreshSchedules, update } = useSchedules();

  const { moment } = useMoment();
  const createSchedule = async (med, expireDate, plan, startDate, addToCalendar = false) => {
    const createdAt = moment();
    const s = {
      id: uuid(),
      createdAt: createdAt.toISOString(),
      active: true,
      med,
      medExpireDate: moment(expireDate).toISOString(),
      medCount: med.containerCount,
      medDiscarded: false,
      plan,
      events: generateEvents(plan, startDate),
    };

    console.log(JSON.stringify(s, undefined, 2));

    // const res = await postSchedule(s);
    // return await res.json();

    await addSchedule(s);
    refreshSchedules();
    return s;
  };

  const generateEvents = (plan, startDate) => {
    const first = moment(startDate);
    const events = [];

    const intervalHours = plan.intervalDays * 24 / plan.frequency;
    const planEnd = first.clone().add(plan.duration, 'days');

    for (let d = first.clone(); d.isSameOrBefore(planEnd); d = d.add(intervalHours, 'hours')) {
      console.log(d);
      events.push({
        id: uuid(),
        date: d.toISOString(),
        intakeCount: 1,
        taken: false,
        addedToCalendar: false
      });
    }

    return events;
  };

  // const postSchedule = async (data) => {
  //   options = {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify(data)
  //   }

  //   return await fetch(`${API_URL}/schedules`, options);
  // }

  const planString = (plan) => {
    const f = `${plan.frequency}x`;
    let d = plan.intervalDays.toString();
    if (plan.intervalDays > 1) {
      d = "a cada " + d + " dias"
    } else {
      d = "por dia"
    }
    const dur = plan.duration > 1 ? `por ${plan.duration} dias` : `por ${plan.duration} dia`

    return `${f} ${d} ${dur}`;
  }

  const toggleTaken = async (scheduleId, eventId) => {
    // const scheduleUrl = `${API_URL}/schedules/${scheduleId}`;
    // const res = await fetch(scheduleUrl);
    // const schedule = await res.json();
    const scheduleIdx = schedules.findIndex(s => s.id === scheduleId);
    if (scheduleIdx < 0) {
      return;
    }
    const schedule = {...schedules[scheduleIdx]};

    const idx = schedule.events.findIndex(e => e.id === eventId);
    if (idx < 0) {
      return;
    }

    schedule.events[idx].taken = !schedule.events[idx].taken;
    if (schedule.events[idx].taken) {
      schedule.medCount -= 1;
    } else {
      schedule.medCount += 1;
    }
    await update(scheduleId, schedule);

    // options = {
    //   method: 'PUT',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(schedule)
    // }

    // return await fetch(scheduleUrl, options);
  }

  // const updateSchedule = async (scheduleId, updates) => {
  //   const scheduleUrl = `${API_URL}/schedules/${scheduleId}`;
  //   const res = await fetch(scheduleUrl);
  //   const schedule = await res.json();

  //   const updated = {...schedule, ...updates};
  //   console.log(updated);

  //   options = {
  //     method: 'PUT',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify(updated)
  //   }

  //   return await fetch(scheduleUrl, options);
  // }

  const toggleDiscardScheduleMed = async (scheduleId) => {
    refreshSchedules();
    const scheduleIdx = schedules.findIndex(s => s.id === scheduleId);
    if (scheduleIdx < 0) {
      return;
    }
    const schedule = {...schedules[scheduleIdx]};
    
    schedule.medDiscarded = !schedule.medDiscarded;

    await update(scheduleId, schedule);

    // options = {
    //   method: 'PUT',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(schedule)
    // }

    // return await fetch(scheduleUrl, options);
  }
  return { createSchedule, planString, toggleTaken, toggleDiscardScheduleMed };
}
