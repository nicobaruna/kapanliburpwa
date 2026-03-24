import React, {forwardRef} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {LongWeekend} from '../data/holidays2026';
import {formatLongWeekendRange, getDaysUntil, countdownLabel} from '../utils/dateUtils';

type Props = {
  lw: LongWeekend;
  accentColor: string;
};

const LongWeekendShareCard = forwardRef<View, Props>(({lw, accentColor}, ref) => {
  const daysUntil = getDaysUntil(lw.startDate);
  const isActive = getDaysUntil(lw.startDate) <= 0 && getDaysUntil(lw.endDate) >= 0;
  const uniqueHolidays = lw.holidays.filter(
    (h, idx, arr) => arr.findIndex(x => x.id === h.id) === idx,
  );

  return (
    <View ref={ref} collapsable={false} style={[styles.card, {backgroundColor: accentColor}]}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.flag}>🇮🇩</Text>
        <Text style={styles.brand}>LIBUR INDONESIA 2026</Text>
      </View>

      {/* Main section */}
      <View style={styles.main}>
        <Text style={styles.emojiLarge}>🏖️</Text>
        <Text style={styles.title} numberOfLines={2}>{lw.label}</Text>
        <Text style={styles.dateRange}>📅 {formatLongWeekendRange(lw)}</Text>
      </View>

      {/* Day count badge */}
      <View style={styles.dayBadge}>
        <Text style={styles.dayNumber}>{lw.totalDays}</Text>
        <Text style={styles.dayLabel}>HARI LIBUR</Text>
      </View>

      {/* Countdown pill */}
      <View style={styles.countdownWrap}>
        <Text style={styles.countdown}>
          {isActive ? '🎉 Sedang berlangsung!' : `⏳ ${countdownLabel(daysUntil)}`}
        </Text>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Holiday list */}
      <View style={styles.holidayList}>
        {uniqueHolidays.map(h => (
          <View key={h.id} style={styles.holidayRow}>
            <Text style={styles.holidayEmoji}>{h.emoji}</Text>
            <Text style={styles.holidayName} numberOfLines={1}>{h.shortName}</Text>
          </View>
        ))}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerLine} />
        <Text style={styles.footerSource}>Sumber: Kalender Bank Indonesia 2026</Text>
        <Text style={styles.footerHash}>#LongWeekend #LiburNasional #Indonesia</Text>
      </View>

    </View>
  );
});

export default LongWeekendShareCard;

const styles = StyleSheet.create({
  card: {
    width: 360,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 20,
  },
  flag: {
    fontSize: 18,
  },
  brand: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  main: {
    alignItems: 'center',
    marginBottom: 16,
  },
  emojiLarge: {
    fontSize: 52,
    marginBottom: 10,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 30,
    marginBottom: 8,
  },
  dateRange: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  dayBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignSelf: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  dayNumber: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: '900',
    lineHeight: 44,
  },
  dayLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  countdownWrap: {
    alignItems: 'center',
    marginBottom: 16,
  },
  countdown: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    overflow: 'hidden',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.25)',
    marginBottom: 14,
  },
  holidayList: {
    gap: 8,
    marginBottom: 18,
  },
  holidayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  holidayEmoji: {
    fontSize: 18,
  },
  holidayName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
  },
  footer: {
    alignItems: 'center',
    gap: 4,
  },
  footerLine: {
    width: 40,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.35)',
    borderRadius: 1,
    marginBottom: 6,
  },
  footerSource: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 10,
    textAlign: 'center',
  },
  footerHash: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 10,
    textAlign: 'center',
  },
});
