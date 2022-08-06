package com.ruoyi.common.utils;

import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Date;

/**
 * 返回几天前几小时前
 *
 * @author liyang
 * @date 2022-08-07
 */
public class RelativeDateUtils {

    private static final Long ONE_MINUTE = 60000L;

    private static final Long ONE_HOUR = 3600000L;

    private static final Long ONE_DAY = 86400000L;

    private static final Long ONE_WEEK = 604800000L;

    private static final String ONE_SECOND_AGO = "秒前";

    private static final String ONE_MINUTE_AGO = "分钟前";

    private static final String ONE_HOUR_AGO = "小时前";

    private static final String ONE_DAY_AGO = "天前";

    private static final String ONE_MONTH_AGO = "月前";

    private static final String ONE_YEAR_AGO = "年前";

    /**
     * 字符串转LocalDateTime
     *
     * @param strDateTime 时间字符串
     * @param formatter   格式化字符串
     * @return LocalDateTime
     */
    public static LocalDateTime strToLocalDateTime(String strDateTime, String formatter) {
        return LocalDateTime.parse(strDateTime, DateTimeFormatter.ofPattern(formatter));
    }

    /**
     * LocalDateTime转字符串
     *
     * @param localDateTime 时间字符串
     * @param formatter     格式化字符串
     * @return LocalDateTime
     */
    public static String localDateTimeToStr(LocalDateTime localDateTime, String formatter) {
        return DateTimeFormatter.ofPattern(formatter).format(localDateTime);
    }

    /**
     * LocalDateTime转Date
     *
     * @param localDateTime local日期时间
     * @return Date
     */
    public static Date localDateTimeToDate(LocalDateTime localDateTime) {
        final ZoneId zoneId = ZoneId.systemDefault();
        final Instant instant = localDateTime.atZone(zoneId).toInstant();
        return Date.from(instant);
    }

    /**
     * Date转LocalDateTime
     *
     * @param date 时间
     * @return LocalDateTime
     */
    public static LocalDateTime dateToLocalDatTime(Date date) {
        final Instant instant = date.toInstant();
        return instant.atZone(ZoneId.systemDefault()).toLocalDateTime();
    }

    /**
     * Date转String
     *
     * @param date      时间
     * @param formatter 格式化方式
     * @return 字符串时间
     */
    public static String dateToStr(Date date, String formatter) {
        SimpleDateFormat sdf = new SimpleDateFormat(formatter);
        return sdf.format(date);
    }

    /**
     * Date转String
     *
     * @param dateTime  时间字符串
     * @param formatter 格式化方式
     * @return Date时间
     */
    public static Date strToDate(String dateTime, String formatter) {
        Date date = null;
        DateFormat dateFormat = new SimpleDateFormat(formatter);
        try {
            date = dateFormat.parse(dateTime);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return date;
    }

    /**
     * sql的Timestamp转LocalDateTime
     *
     * @param timestamp 时间戳
     */
    public static LocalDateTime timestampToLocalDateTime(Timestamp timestamp) {
        final Timestamp time = Timestamp.from(Instant.now());
        return time.toLocalDateTime();
    }

    /**
     * 当前LocalDateTime转sql的Timestamp（LocalDateTime当前时间转换时间戳）
     */
    public static Timestamp localDateTimeToTimestamp() {
        return Timestamp.valueOf(LocalDateTime.now());
    }

    public static String format(Date date) {
        long delta = new Date().getTime() - date.getTime();
        if (delta < ONE_MINUTE) {
            long seconds = toSeconds(delta);
            return (seconds <= 0 ? 1 : seconds) + ONE_SECOND_AGO;
        }

        if (delta < 45L * ONE_MINUTE) {
            long minutes = toMinutes(delta);
            return (minutes <= 0 ? 1 : minutes) + ONE_MINUTE_AGO;
        }

        if (delta < 24L * ONE_HOUR) {
            long hours = toHours(delta);
            return (hours <= 0 ? 1 : hours) + ONE_HOUR_AGO;
        }

        if (delta < 48L * ONE_HOUR) {
            return "昨天";
        }

        if (delta < 30L * ONE_DAY) {
            long days = toDays(delta);
            return (days <= 0 ? 1 : days) + ONE_DAY_AGO;
        }

        if (delta < 12L * 4L * ONE_WEEK) {
            long months = toMonths(delta);
            return (months <= 0 ? 1 : months) + ONE_MONTH_AGO;

        } else {
            long years = toYears(delta);
            return (years <= 0 ? 1 : years) + ONE_YEAR_AGO;
        }
    }

    private static long toSeconds(long date) {
        return date / 1000L;
    }

    private static long toMinutes(long date) {
        return toSeconds(date) / 60L;
    }

    private static long toHours(long date) {
        return toMinutes(date) / 60L;
    }

    private static long toDays(long date) {
        return toHours(date) / 24L;

    }

    private static long toMonths(long date) {
        return toDays(date) / 30L;

    }

    private static long toYears(long date) {
        return toMonths(date) / 365L;

    }

    public static void main(String[] args) throws ParseException {
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:m:s");
        Date date = format.parse("2022-08-05 02:30:40");
        System.out.println(format(date));
    }
    // 原文链接：https://blog.csdn.net/weixin_31936127/article/details/114151260
}
