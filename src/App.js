import React, { useState, useEffect } from 'react';
import { Moon, Sun, MapPin, Calendar, Settings, Clock, Globe } from 'lucide-react';

const PrayerTimesApp = () => {
  const [location, setLocation] = useState(null);
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [nextPrayer, setNextPrayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [language, setLanguage] = useState('en');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [settings, setSettings] = useState({
    calculationMethod: 2,
    asrMethod: 1,
    madhab: 0
  });

  const translations = {
    en: {
      dir: 'ltr',
      prayerTimes: 'Prayer Times',
      nextPrayer: 'Next Prayer',
      currentTime: 'Current Time',
      loading: 'Loading Prayer Times...',
      refresh: 'Refresh Prayer Times',
      calculationMethod: 'Calculation Method: Muslim World League',
      basedOnLocation: 'Times are based on your location',
      notPrayerTime: 'Not a prayer time',
      prayers: {
        Fajr: 'Fajr',
        Sunrise: 'Sunrise',
        Dhuhr: 'Dhuhr',
        Asr: 'Asr',
        Maghrib: 'Maghrib',
        Isha: 'Isha'
      },
      days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    },
    ar: {
      dir: 'rtl',
      prayerTimes: 'أوقات الصلاة',
      nextPrayer: 'الصلاة التالية',
      currentTime: 'الوقت الحالي',
      loading: 'جاري تحميل أوقات الصلاة...',
      refresh: 'تحديث أوقات الصلاة',
      calculationMethod: 'طريقة الحساب: رابطة العالم الإسلامي',
      basedOnLocation: 'الأوقات بناءً على موقعك',
      notPrayerTime: 'ليس وقت صلاة',
      prayers: {
        Fajr: 'الفجر',
        Sunrise: 'الشروق',
        Dhuhr: 'الظهر',
        Asr: 'العصر',
        Maghrib: 'المغرب',
        Isha: 'العشاء'
      },
      days: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
      months: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
    },
    ur: {
      dir: 'rtl',
      prayerTimes: 'نماز کے اوقات',
      nextPrayer: 'اگلی نماز',
      currentTime: 'موجودہ وقت',
      loading: 'نماز کے اوقات لوڈ ہو رہے ہیں...',
      refresh: 'نماز کے اوقات تازہ کریں',
      calculationMethod: 'حساب کا طریقہ: مسلم ورلڈ لیگ',
      basedOnLocation: 'اوقات آپ کے مقام پر مبنی ہیں',
      notPrayerTime: 'نماز کا وقت نہیں',
      prayers: {
        Fajr: 'فجر',
        Sunrise: 'طلوع آفتاب',
        Dhuhr: 'ظہر',
        Asr: 'عصر',
        Maghrib: 'مغرب',
        Isha: 'عشاء'
      },
      days: ['اتوار', 'پیر', 'منگل', 'بدھ', 'جمعرات', 'جمعہ', 'ہفتہ'],
      months: ['جنوری', 'فروری', 'مارچ', 'اپریل', 'مئی', 'جون', 'جولائی', 'اگست', 'ستمبر', 'اکتوبر', 'نومبر', 'دسمبر']
    },
    tr: {
      dir: 'ltr',
      prayerTimes: 'Namaz Vakitleri',
      nextPrayer: 'Sonraki Namaz',
      currentTime: 'Şimdiki Zaman',
      loading: 'Namaz Vakitleri Yükleniyor...',
      refresh: 'Namaz Vakitlerini Yenile',
      calculationMethod: 'Hesaplama Yöntemi: Müslüman Dünya Birliği',
      basedOnLocation: 'Vakitler konumunuza göre',
      notPrayerTime: 'Namaz vakti değil',
      prayers: {
        Fajr: 'İmsak',
        Sunrise: 'Güneş',
        Dhuhr: 'Öğle',
        Asr: 'İkindi',
        Maghrib: 'Akşam',
        Isha: 'Yatsı'
      },
      days: ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'],
      months: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']
    },
    ms: {
      dir: 'ltr',
      prayerTimes: 'Waktu Solat',
      nextPrayer: 'Solat Seterusnya',
      currentTime: 'Masa Sekarang',
      loading: 'Memuatkan Waktu Solat...',
      refresh: 'Muat Semula Waktu Solat',
      calculationMethod: 'Kaedah Pengiraan: Liga Dunia Islam',
      basedOnLocation: 'Waktu berdasarkan lokasi anda',
      notPrayerTime: 'Bukan waktu solat',
      prayers: {
        Fajr: 'Subuh',
        Sunrise: 'Syuruk',
        Dhuhr: 'Zohor',
        Asr: 'Asar',
        Maghrib: 'Maghrib',
        Isha: 'Isyak'
      },
      days: ['Ahad', 'Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu'],
      months: ['Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun', 'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember']
    },
    fr: {
      dir: 'ltr',
      prayerTimes: 'Horaires de Prière',
      nextPrayer: 'Prochaine Prière',
      currentTime: 'Heure Actuelle',
      loading: 'Chargement des Horaires...',
      refresh: 'Actualiser les Horaires',
      calculationMethod: 'Méthode: Ligue Islamique Mondiale',
      basedOnLocation: 'Horaires basés sur votre position',
      notPrayerTime: 'Pas une heure de prière',
      prayers: {
        Fajr: 'Fajr',
        Sunrise: 'Lever du soleil',
        Dhuhr: 'Dhuhr',
        Asr: 'Asr',
        Maghrib: 'Maghrib',
        Isha: 'Isha'
      },
      days: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
      months: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
    }
  };

  const languages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'ar', name: 'Arabic', native: 'العربية' },
    { code: 'ur', name: 'Urdu', native: 'اردو' },
    { code: 'tr', name: 'Turkish', native: 'Türkçe' },
    { code: 'ms', name: 'Malay', native: 'Bahasa Melayu' },
    { code: 'fr', name: 'French', native: 'Français' }
  ];

  const t = translations[language];
  const isRTL = t.dir === 'rtl';

  useEffect(() => {
    getCurrentLocation();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (location) {
      fetchPrayerTimes();
    }
  }, [location, settings]);

  useEffect(() => {
    if (prayerTimes) {
      calculateNextPrayer();
    }
  }, [prayerTimes, currentTime]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          getCityName(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocation({ lat: 21.4225, lng: 39.8262, city: 'Makkah' });
          setLoading(false);
        }
      );
    }
  };

  const getCityName = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      );
      const data = await response.json();
      setLocation(prev => ({
        ...prev,
        city: data.city || data.locality || 'Unknown Location'
      }));
    } catch (error) {
      console.error('Error getting city name:', error);
    }
  };

  const fetchPrayerTimes = async () => {
    setLoading(true);
    try {
      const date = new Date();
      const response = await fetch(
        `https://api.aladhan.com/v1/timings/${Math.floor(date.getTime() / 1000)}?latitude=${location.lat}&longitude=${location.lng}&method=${settings.calculationMethod}&school=${settings.madhab}`
      );
      const data = await response.json();
      
      if (data.code === 200) {
        setPrayerTimes(data.data.timings);
      }
    } catch (error) {
      console.error('Error fetching prayer times:', error);
    }
    setLoading(false);
  };

  const calculateNextPrayer = () => {
    if (!prayerTimes) return;

    const now = currentTime;
    const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    
    for (let prayer of prayers) {
      const [hours, minutes] = prayerTimes[prayer].split(':');
      const prayerTime = new Date(now);
      prayerTime.setHours(parseInt(hours), parseInt(minutes), 0);

      if (prayerTime > now) {
        const diff = prayerTime - now;
        const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
        const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secondsLeft = Math.floor((diff % (1000 * 60)) / 1000);
        
        setNextPrayer({
          name: prayer,
          time: prayerTimes[prayer],
          timeLeft: `${hoursLeft}h ${minutesLeft}m ${secondsLeft}s`
        });
        return;
      }
    }

    const [hours, minutes] = prayerTimes.Fajr.split(':');
    const fajrTomorrow = new Date(now);
    fajrTomorrow.setDate(fajrTomorrow.getDate() + 1);
    fajrTomorrow.setHours(parseInt(hours), parseInt(minutes), 0);
    
    const diff = fajrTomorrow - now;
    const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
    const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secondsLeft = Math.floor((diff % (1000 * 60)) / 1000);
    
    setNextPrayer({
      name: 'Fajr',
      time: prayerTimes.Fajr,
      timeLeft: `${hoursLeft}h ${minutesLeft}m ${secondsLeft}s`
    });
  };

  const formatTime12Hour = (time24) => {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const formatDate = (date) => {
    const dayName = t.days[date.getDay()];
    const monthName = t.months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    
    if (isRTL) {
      return `${dayName}، ${day} ${monthName} ${year}`;
    }
    return `${dayName}, ${monthName} ${day}, ${year}`;
  };

  if (loading || !prayerTimes) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900 flex items-center justify-center">
        <div className="text-center">
          <Moon className="w-16 h-16 text-amber-300 animate-pulse mx-auto mb-4" />
          <p className="text-white text-xl">{t.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900 pb-20" dir={t.dir}>
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-700 shadow-lg">
        <div className="max-w-md mx-auto px-6 py-6">
          <div className={`flex items-center justify-between mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Moon className="w-8 h-8 text-amber-300" />
              <h1 className="text-2xl font-bold text-white">{t.prayerTimes}</h1>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                className="p-2 hover:bg-emerald-700 rounded-lg transition-colors"
              >
                <Globe className="w-6 h-6 text-amber-200" />
              </button>
              
              {showLanguageMenu && (
                <div className={`absolute top-12 ${isRTL ? 'left-0' : 'right-0'} bg-white rounded-lg shadow-xl z-50 w-48`}>
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setShowLanguageMenu(false);
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-emerald-50 transition-colors ${
                        language === lang.code ? 'bg-emerald-100 font-semibold' : ''
                      } ${lang.code === 'en' ? 'rounded-t-lg' : ''} ${
                        lang.code === 'fr' ? 'rounded-b-lg' : ''
                      }`}
                    >
                      <div className="text-sm text-gray-800">{lang.native}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className={`flex items-center gap-2 text-emerald-100 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{location?.city || 'Locating...'}</span>
          </div>
          
          <div className={`flex items-center gap-2 text-emerald-100 mt-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{formatDate(currentTime)}</span>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 py-6">
        {/* Next Prayer Card */}
        {nextPrayer && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border-2 border-amber-400">
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-1">{t.nextPrayer}</p>
              <h2 className="text-3xl font-bold text-emerald-800 mb-2">
                {t.prayers[nextPrayer.name]}
              </h2>
              <div className="text-4xl font-bold text-teal-600 mb-3">
                {formatTime12Hour(nextPrayer.time)}
              </div>
              <div className={`flex items-center justify-center gap-2 text-amber-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Clock className="w-5 h-5" />
                <span className="text-lg font-semibold">{nextPrayer.timeLeft}</span>
              </div>
            </div>
          </div>
        )}

        {/* Current Time */}
        <div className="text-center mb-6">
          <p className="text-emerald-100 text-sm mb-1">{t.currentTime}</p>
          <p className="text-white text-2xl font-semibold">
            {currentTime.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit', 
              second: '2-digit' 
            })}
          </p>
        </div>

        {/* Prayer Times List */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((prayer, index) => {
            const isNext = nextPrayer?.name === prayer;
            
            return (
              <div
                key={prayer}
                className={`flex items-center justify-between p-5 ${
                  index !== 5 ? 'border-b border-gray-100' : ''
                } ${isNext ? 'bg-emerald-50' : 'hover:bg-gray-50'} transition-colors ${
                  isRTL ? 'flex-row-reverse' : ''
                }`}
              >
                <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    isNext 
                      ? 'bg-emerald-100' 
                      : prayer === 'Sunrise' 
                      ? 'bg-amber-100' 
                      : 'bg-teal-100'
                  }`}>
                    {prayer === 'Sunrise' ? (
                      <Sun className={`w-6 h-6 ${isNext ? 'text-emerald-600' : 'text-amber-600'}`} />
                    ) : (
                      <Moon className={`w-6 h-6 ${isNext ? 'text-emerald-600' : 'text-teal-600'}`} />
                    )}
                  </div>
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                    <h3 className={`text-lg font-semibold ${
                      isNext ? 'text-emerald-800' : 'text-gray-800'
                    }`}>
                      {t.prayers[prayer]}
                    </h3>
                    {prayer === 'Sunrise' && (
                      <p className="text-xs text-gray-500">{t.notPrayerTime}</p>
                    )}
                  </div>
                </div>
                <div className={`text-xl font-bold ${
                  isNext ? 'text-emerald-600' : 'text-gray-700'
                }`}>
                  {formatTime12Hour(prayerTimes[prayer])}
                </div>
              </div>
            );
          })}
        </div>

        {/* Refresh Button */}
        <button
          onClick={fetchPrayerTimes}
          className={`w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 rounded-xl shadow-lg transition-colors duration-200 flex items-center justify-center gap-2 ${
            isRTL ? 'flex-row-reverse' : ''
          }`}
        >
          <Settings className="w-5 h-5" />
          {t.refresh}
        </button>

        {/* Footer Info */}
        <div className="text-center mt-6 text-emerald-100 text-sm">
          <p>{t.calculationMethod}</p>
          <p className="mt-1">{t.basedOnLocation}</p>
        </div>
      </div>
    </div>
  );
};

export default PrayerTimesApp;