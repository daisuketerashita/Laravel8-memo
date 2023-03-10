import { Calendar } from "@fullcalendar/core";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import axios from 'axios';

var calendarEl = document.getElementById("calendar");

let calendar = new Calendar(calendarEl, {
    plugins: [interactionPlugin, dayGridPlugin],
    initialView: "dayGridMonth",
    headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,listWeek",
    },
    locale: "ja",
    
    dateClick: (e) => {
        console.log(e.dateStr);

        axios
            .get("/calendar/add/" + e.dateStr)
            .then((res) => {
                location.href = "/calendar/add/" + e.dateStr;
            })
            .catch(() => {
                alert("登録に失敗しました");
            });
    },

    events: function (info, successCallback, failureCallback) {
        // Laravelのイベント取得処理の呼び出し
        axios
            .post("/schedule-get", {
                start_date: info.start.valueOf(),
                end_date: info.end.valueOf(),
            })
            .then((response) => {
                // 追加したイベントを削除
                calendar.removeAllEvents();
                // カレンダーに読み込み
                successCallback(response.data);
            })
            .catch(() => {
                // バリデーションエラーなど
                alert("登録に失敗しました");
            });
    },
});
calendar.render();