const { Telegraf } = require("telegraf");
const Student = require("../models/students");
const mongoose = require("mongoose");
const bot = new Telegraf("986785690:AAH5awaR1tJANp-oGS4t_2vNJPJztioCkdI");

const { CronJob } = require("cron");

mongoose.connect("mongodb://localhost:27017/elbrusBirthday", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

bot.help((ctx) => ctx.reply("Send me a sticker"));
bot.start((ctx) => {
  const job = new CronJob(
    "20 * * * * *",
    async function () {
      await ctx.reply(new Date());
    },
    null,
    true,
    "Europe/Moscow"
  );
  job.start();
});

bot.hears("today", async (ctx) => {
  let today = new Date().toDateString().split(" ");
  [todayMonth, todayDay] = [today[1], today[2]];
  let students = await Student.find();
  let studentsToday = students.filter((student) => {
    let studentDate = student.dateOfBirth.toDateString().split(" ");
    [StudenttodayMonth, StudenttodayDay] = [studentDate[1], studentDate[2]];
    return todayMonth === StudenttodayMonth && todayDay === StudenttodayDay;
  });
  if (studentsToday.length) {
    studentsToday.forEach((element) => {
      ctx.reply(
        `У студента ${element.firstName} ${
          element.lastName
        } сегодня день рождения. Локация: ${
          element.typeBootCamp === "moscow"
            ? "Москва"
            : element.typeBootCamp === "spb"
            ? "Санкт-Петербург"
            : "Онлайн"
        }.`
      );
    });
  } else {
    await ctx.reply("Сегодня ни у кого нет дня рождения");
  }
});

bot.hears("tomorrow", async (ctx) => {
  let tomorrow = new Date(Date.now() + 1000 * 60 * 60 * 24 + 1000 * 60 * 60 * 3)
    .toDateString()
    .split(" ");
  [tomorrowMonth, tomorrowDay] = [tomorrow[1], tomorrow[2]];
  let students = await Student.find();
  let studentsTomorrow = students.filter((student) => {
    let studentDate = student.dateOfBirth.toDateString().split(" ");
    [StudentTomorrowMonth, StudentTomorrowDay] = [
      studentDate[1],
      studentDate[2],
    ];
    return (
      tomorrowMonth === StudentTomorrowMonth &&
      tomorrowDay === StudentTomorrowDay
    );
  });
  if (studentsTomorrow.length) {
    studentsTomorrow.forEach((element) => {
      ctx.reply(
        `У студента ${element.firstName} ${
          element.lastName
        } Завтра день рождения \n Локация: ${
          element.typeBootCamp === "moscow"
            ? "Москва"
            : element.typeBootCamp === "spb"
            ? "Санкт-Петербург"
            : "Онлайн"
        }.`
      );
    });
  } else {
    await ctx.reply("Завтра ни у кого нет дня рождения");
  }
  // ctx.reply(new Date().getDate());

  //   let today = new Date().toDateString().split(" ")
  //   let newMonthTomorrow = false;
  //   // Проверка на конец месяца
  //   if (today[1] === 'Feb' && today[3] % 4 === 0 && today[2] === '29') {
  //     newMonthTomorrow = true;
  //   } else if (today[1] === 'Sep' || today[1] === 'Apr' || today[1] === 'Jun' || today[1] === 'Nov' && Number(today[2]) === 30) {
  //     newMonthTomorrow = true
  //   } else if (today[2] === '31') {
  //     newMonthTomorrow = true
  //   } else if (today[1] === 'Feb' && today[2] === '28') {
  //     newMonthTomorrow = true
  //   }
  // // Если завтра - не новый месяц...
  //   if (!newMonthTomorrow) {
  //     // Кладем в tomorrow текущий месяц и завтрашний день
  //     let tomorrow = [today[1], Number(today[2]) + 1];
  //     let [tomorrowMonth, tomorrowDay] = [tomorrow[0], tomorrow[1]]
  //     let students = await Student.find();
  //     let studentsToday = students.filter((student) => {
  //       let studentDate = student.dateOfBirth.toDateString().split(" ");
  //       [studentBDMonth, studentBDDay] = [studentDate[1], studentDate[2]];
  //       return tomorrowMonth === studentBDMonth && tomorrowDay === Number(studentBDDay);
  //     });
  //     if (studentsToday.length) {
  //       studentsToday.forEach((element) => {
  //         ctx.reply(
  //           `У студента ${element.firstName} ${element.lastName} завтра день рождения. Локация: ${element.typeBootCamp === 'moscow' ? 'Москва' : element.typeBootCamp === 'spb' ? 'Санкт-Петербург' : 'Онлайн'}.`
  //         );
  //       })} else {
  //       await ctx.reply('Завтра ни у кого нет дня рождения')
  //     }
  //   } else {
  //     // Нужно изменение месяца
  //     // *************************************
  //     console.log("ЭТО НАДО БУДЕТ ДОПИСАТЬ")
  //     await ctx.reply('Сори, пока не работает')
  //     // *************************************
  //   }
});

bot.on("sticker", (ctx) => ctx.reply("👍"));

bot.launch();
