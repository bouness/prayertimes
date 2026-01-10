import React, { useState, useEffect, useCallback } from 'react';
import { Moon, Sun, MapPin, Calendar, Settings, Clock, Globe, Volume2, VolumeX, Book, X } from 'lucide-react';

const PrayerTimesApp = () => {
  // Load initial state from localStorage
  const [location, setLocation] = useState(null);
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [nextPrayer, setNextPrayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showAdhkar, setShowAdhkar] = useState(false);
  const [adhkarType, setAdhkarType] = useState('morning');
  const [hijriDate, setHijriDate] = useState(null);
  
  // Settings with localStorage persistence
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('prayerApp_language');
    return saved || 'en';
  });
  
  const [adhanEnabled, setAdhanEnabled] = useState(() => {
    const saved = localStorage.getItem('prayerApp_adhanEnabled');
    return saved ? JSON.parse(saved) : false;
  });
  
  const calculationMethod = 2;
  const madhab = 0;

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
      adhanEnabled: 'Adhan ON',
      adhanDisabled: 'Adhan OFF',
      adhkar: 'Daily Adhkar',
      morningAdhkar: 'Morning Adhkar',
      eveningAdhkar: 'Evening Adhkar',
      testAdhan: 'Test Adhan',
      fridayPrayer: 'Friday Prayer',
      prayers: {
        Fajr: 'Fajr',
        Sunrise: 'Sunrise',
        Dhuhr: 'Dhuhr',
        Jumuah: 'Jumu\'ah',
        Asr: 'Asr',
        Maghrib: 'Maghrib',
        Isha: 'Isha'
      },
      translation: 'Translation',
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
      adhanEnabled: 'الأذان مفعل',
      adhanDisabled: 'الأذان معطل',
      adhkar: 'الأذكار اليومية',
      morningAdhkar: 'أذكار الصباح',
      eveningAdhkar: 'أذكار المساء',
      testAdhan: 'تجربة الأذان',
      fridayPrayer: 'صلاة الجمعة',
      prayers: {
        Fajr: 'الفجر',
        Sunrise: 'الشروق',
        Dhuhr: 'الظهر',
        Jumuah: 'الجمعة',
        Asr: 'العصر',
        Maghrib: 'المغرب',
        Isha: 'العشاء'
      },
      translation: 'ترجمة',
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
      adhanEnabled: 'اذان فعال', 
      adhanDisabled: 'اذان غیر فعال',
      adhkar: 'روزانہ اذکار', 
      morningAdhkar: 'صبح کے اذکار', 
      eveningAdhkar: 'شام کے اذکار',
      testAdhan: 'اذان کی آزمائش',
      fridayPrayer: 'جمعہ کی نماز',
      prayers: { 
        Fajr: 'فجر', 
        Sunrise: 'طلوع آفتاب', 
        Dhuhr: 'ظہر', 
        Jumuah: 'جمعہ', 
        Asr: 'عصر', 
        Maghrib: 'مغرب', 
        Isha: 'عشاء' 
      },
      translation: 'ترجمہ',
      days: ['اتوار', 'پیر', 'منگل', 'بدھ', 'جمعرات', 'جمعہ', 'ہفتہ'],
      months: ['جنوری', 'فروری', 'مارچ', 'اپریل', 'مئی', 'جون', 'جولائی', 'اگست', 'ستمبر', 'اکتوبر', 'نوفمبر', 'دسمبر']
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
      adhanEnabled: 'Ezan Açık', 
      adhanDisabled: 'Ezan Kapalı',
      adhkar: 'Günlük Zikirler', 
      morningAdhkar: 'Sabah Zikirleri', 
      eveningAdhkar: 'Akşam Zikirleri',
      testAdhan: 'Ezanı Test Et',
      fridayPrayer: 'Cuma Namazı',
      prayers: { 
        Fajr: 'İmsak', 
        Sunrise: 'Güneş', 
        Dhuhr: 'Öğle', 
        Jumuah: 'Cuma', 
        Asr: 'İkindi', 
        Maghrib: 'Akşam', 
        Isha: 'Yatsı' 
      },
      translation: 'Çeviri',
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
      adhanEnabled: 'Azan ON', 
      adhanDisabled: 'Azan OFF',
      adhkar: 'Zikir Harian', 
      morningAdhkar: 'Zikir Pagi', 
      eveningAdhkar: 'Zikir Petang',
      testAdhan: 'Uji Azan',
      fridayPrayer: 'Solat Jumaat',
      prayers: { 
        Fajr: 'Subuh', 
        Sunrise: 'Syuruk', 
        Dhuhr: 'Zohor', 
        Jumuah: 'Jumaat', 
        Asr: 'Asar', 
        Maghrib: 'Maghrib', 
        Isha: 'Isyak' 
      },
      translation: 'Terjemahan',
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
      adhanEnabled: 'Adhan ON', 
      adhanDisabled: 'Adhan OFF',
      adhkar: 'Adhkar Quotidiens', 
      morningAdhkar: 'Adhkar du Matin', 
      eveningAdhkar: 'Adhkar du Soir',
      testAdhan: 'Tester l\'Adhan',
      fridayPrayer: 'Prières du Vendredi',
      prayers: { 
        Fajr: 'Fajr', 
        Sunrise: 'Lever du soleil', 
        Dhuhr: 'Dhuhr', 
        Jumuah: 'Jumu\'ah', 
        Asr: 'Asr', 
        Maghrib: 'Maghrib', 
        Isha: 'Isha' 
      },
      translation: 'Traduction',
      days: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
      months: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
    }
  };

  // Updated Adhkar data with translations for all languages
  const adhkarData = {
    morning: [
      { 
        ar: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ', 
        en: 'We have entered morning, and all sovereignty belongs to Allah',
        ur: 'ہم نے صبح کی اور تمام بادشاہی اللہ کی ہے',
        tr: 'Sabaha girdik ve tüm egemenlik Allah\'ındır',
        ms: 'Kami telah memasuki pagi, dan segala kedaulatan adalah milik Allah',
        fr: 'Nous avons entré le matin, et toute souveraineté appartient à Allah'
      },
      { 
        ar: 'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ', 
        en: 'O Allah, by You we enter morning and evening, by You we live and die, and to You is the resurrection',
        ur: 'اے اللہ! تیرے ذریعے ہم صبح اور شام کو پہنچتے ہیں، تیرے ذریعے ہم جیتے اور مرتے ہیں، اور تیری طرف ہی پلٹ کر جانا ہے',
        tr: 'Allah\'ım, seninle sabaha ereriz, seninle akşama ereriz, seninle yaşarız, seninle ölürüz ve dönüş sanadır',
        ms: 'Ya Allah, dengan Engkau kami masuk pagi dan petang, dengan Engkau kami hidup dan mati, dan kepada Engkaulah kebangkitan',
        fr: 'Ô Allah, par Toi nous entrons le matin et le soir, par Toi nous vivons et mourons, et vers Toi est la résurrection'
      },
      { 
        ar: 'أَصْبَحْنَا عَلَى فِطْرَةِ الْإِسْلَامِ وَكَلِمَةِ الْإِخْلَاصِ', 
        en: 'We have entered morning upon the natural religion of Islam and the word of sincere devotion',
        ur: 'ہم نے صبح کی اسلام کی فطرت اور اخلاص کے کلمے پر',
        tr: 'Sabaha İslam\'ın fıtratı ve ihlas kelimesi üzere girdik',
        ms: 'Kami telah memasuki pagi atas fitrah Islam dan kalimah ikhlas',
        fr: 'Nous avons entré le matin sur la religion naturelle de l\'Islam et la parole de sincère dévotion'
      },
      { 
        ar: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ (100x)', 
        en: 'Glory is to Allah and praise is to Him',
        ur: 'اللہ پاک ہے اور اس کی حمد ہے',
        tr: 'Allah\'ı tesbih ederim ve O\'na hamd ederim',
        ms: 'Maha Suci Allah dan segala puji bagi-Nya',
        fr: 'Gloire à Allah et louange à Lui'
      },
      { 
        ar: 'لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ (100x)', 
        en: 'There is no deity but Allah alone, with no partner',
        ur: 'اللہ کے سوا کوئی معبود نہیں، وہ اکیلا ہے، اس کا کوئی شریک نہیں',
        tr: 'Allah\'tan başka ilah yoktur, O birdir, ortağı yoktur',
        ms: 'Tiada tuhan melainkan Allah yang Maha Esa, tiada sekutu bagi-Nya',
        fr: 'Il n\'y a de divinité qu\'Allah seul, sans associé'
      },
      { 
        ar: 'رَضِيتُ بِاللَّهِ رَبًّا وَبِالْإِسْلَامِ دِينًا وَبِمُحَمَّدٍ نَبِيًّا (3x)', 
        en: 'I am pleased with Allah as my Lord, Islam as my religion, and Muhammad as my Prophet',
        ur: 'میں اللہ کو اپنا رب، اسلام کو اپنا دین اور محمد صلی اللہ علیہ وسلم کو اپنا نبی مان کر راضی ہوں',
        tr: 'Allah\'ı Rab, İslam\'ı din ve Muhammed\'i peygamber olarak razı oldum',
        ms: 'Aku redha dengan Allah sebagai Tuhanku, Islam sebagai agamaku, dan Muhammad sebagai Nabiku',
        fr: 'Je suis satisfait d\'Allah comme Seigneur, de l\'Islam comme religion, et de Muhammad comme Prophète'
      }
    ],
    evening: [
      { 
        ar: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ', 
        en: 'We have entered evening, and all sovereignty belongs to Allah',
        ur: 'ہم نے شام کی اور تمام بادشاہی اللہ کی ہے',
        tr: 'Akşama girdik ve tüm egemenlik Allah\'ındır',
        ms: 'Kami telah memasuki petang, dan segala kedaulatan adalah milik Allah',
        fr: 'Nous avons entré le soir, et toute souveraineté appartient à Allah'
      },
      { 
        ar: 'اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ', 
        en: 'O Allah, by You we enter evening and morning, by You we live and die, and to You is the final return',
        ur: 'اے اللہ! تیرے ذریعے ہم شام اور صبح کو پہنچتے ہیں، تیرے ذریعے ہم جیتے اور مرتے ہیں، اور تیری طرف ہی پلٹ کر جانا ہے',
        tr: 'Allah\'ım, seninle akşama ereriz, seninle sabaha ereriz, seninle yaşarız, seninle ölürüz ve dönüş sanadır',
        ms: 'Ya Allah, dengan Engkau kami masuk petang dan pagi, dengan Engkau kami hidup dan mati, dan kepada Engkaulah tempat kembali',
        fr: 'Ô Allah, par Toi nous entrons le soir et le matin, par Toi nous vivons et mourons, et vers Toi est le retour final'
      },
      { 
        ar: 'أَمْسَيْنَا عَلَى فِطْرَةِ الْإِسْلَامِ وَكَلِمَةِ الْإِخْلَاصِ', 
        en: 'We have entered evening upon the natural religion of Islam and the word of sincere devotion',
        ur: 'ہم نے شام کی اسلام کی فطرت اور اخلاص کے کلمے پر',
        tr: 'Akşama İslam\'ın fıtratı ve ihlas kelimesi üzere girdik',
        ms: 'Kami telah memasuki petang atas fitrah Islam dan kalimah ikhlas',
        fr: 'Nous avons entré le soir sur la religion naturelle de l\'Islam et la parole de sincère dévotion'
      },
      { 
        ar: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ (100x)', 
        en: 'Glory is to Allah and praise is to Him',
        ur: 'اللہ پاک ہے اور اس کی حمد ہے',
        tr: 'Allah\'ı tesbih ederim ve O\'na hamd ederim',
        ms: 'Maha Suci Allah dan segala puji bagi-Nya',
        fr: 'Gloire à Allah et louange à Lui'
      },
      { 
        ar: 'لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ (100x)', 
        en: 'There is no deity but Allah alone, with no partner',
        ur: 'اللہ کے سوا کوئی معبود نہیں، وہ اکیلا ہے، اس کا کوئی شریک نہیں',
        tr: 'Allah\'tan başka ilah yoktur, O birdir, ortağı yoktur',
        ms: 'Tiada tuhan melainkan Allah yang Maha Esa, tiada sekutu bagi-Nya',
        fr: 'Il n\'y a de divinité qu\'Allah seul, sans associé'
      },
      { 
        ar: 'رَضِيتُ بِاللَّهِ رَبًّا وَبِالْإِسْلَامِ دِينًا وَبِمُحَمَّدٍ نَبِيًّا (3x)', 
        en: 'I am pleased with Allah as my Lord, Islam as my religion, and Muhammad as my Prophet',
        ur: 'میں اللہ کو اپنا رب، اسلام کو اپنا دین اور محمد صلی اللہ علیہ وسلم کو اپنا نبی مان کر راضی ہوں',
        tr: 'Allah\'ı Rab, İslam\'ı din ve Muhammed\'i peygamber olarak razı oldum',
        ms: 'Aku redha dengan Allah sebagai Tuhanku, Islam sebagai agamaku, dan Muhammad sebagai Nabiku',
        fr: 'Je suis satisfait d\'Allah comme Seigneur, de l\'Islam comme religion, et de Muhammad comme Prophète'
      }
    ]
  };

  const languages = [
    { code: 'en', native: 'English' },
    { code: 'ar', native: 'العربية' },
    { code: 'ur', native: 'اردو' },
    { code: 'tr', native: 'Türkçe' },
    { code: 'ms', native: 'Bahasa Melayu' },
    { code: 'fr', native: 'Français' }
  ];

  const t = translations[language];
  const isRTL = t.dir === 'rtl';

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('prayerApp_language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('prayerApp_adhanEnabled', JSON.stringify(adhanEnabled));
  }, [adhanEnabled]);

  const getCityName = useCallback(async (lat, lng) => {
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      );
      const data = await response.json();
      setLocation(prev => ({ ...prev, city: data.city || data.locality || 'Unknown' }));
    } catch (error) {
      console.error('Error getting city:', error);
    }
  }, []);

  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          getCityName(pos.coords.latitude, pos.coords.longitude);
        },
        () => {
          setLocation({ lat: 21.4225, lng: 39.8262, city: 'Makkah' });
          setLoading(false);
        }
      );
    }
  }, [getCityName]);

  const fetchPrayerTimes = useCallback(async () => {
    if (!location) return;
    setLoading(true);
    try {
      const timestamp = Math.floor(Date.now() / 1000);
      const response = await fetch(
        `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${location.lat}&longitude=${location.lng}&method=${calculationMethod}&school=${madhab}`
      );
      const data = await response.json();
      if (data.code === 200) {
        setPrayerTimes(data.data.timings);
        // Get Hijri date from API response
        const hijri = data.data.date.hijri;
        setHijriDate({
          day: hijri.day,
          month: hijri.month.en,
          year: hijri.year,
          monthAr: hijri.month.ar
        });
      }
    } catch (error) {
      console.error('Error fetching times:', error);
    }
    setLoading(false);
  }, [location]);

  const playAdhan = useCallback((isTest = false) => {
    if (!adhanEnabled && !isTest) return;
    const audio = new Audio('/prayertimes/adhan.mp3');
    audio.play().catch(err => {
      console.log('Adhan playback failed:', err);
    });
  }, [adhanEnabled]);

  const testAdhan = () => {
    playAdhan(true);
  };

  const calculateNextPrayer = useCallback(() => {
    if (!prayerTimes) return;
    const now = currentTime;
    const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    const isFriday = now.getDay() === 5;
    
    for (let prayer of prayers) {
      const [h, m] = prayerTimes[prayer].split(':');
      const prayerTime = new Date(now);
      prayerTime.setHours(parseInt(h), parseInt(m), 0);

      if (Math.abs(prayerTime - now) < 60000) playAdhan();

      if (prayerTime > now) {
        const diff = prayerTime - now;
        const hoursLeft = Math.floor(diff / 3600000);
        const minutesLeft = Math.floor((diff % 3600000) / 60000);
        const secondsLeft = Math.floor((diff % 60000) / 1000);
        
        const displayName = (prayer === 'Dhuhr' && isFriday) ? 'Jumuah' : prayer;
        
        setNextPrayer({ 
          name: displayName, 
          time: prayerTimes[prayer], 
          timeLeft: `${hoursLeft}h ${minutesLeft}m ${secondsLeft}s` 
        });
        return;
      }
    }
    
    const [h, m] = prayerTimes.Fajr.split(':');
    const fajr = new Date(now);
    fajr.setDate(fajr.getDate() + 1);
    fajr.setHours(parseInt(h), parseInt(m), 0);
    const diff = fajr - now;
    setNextPrayer({
      name: 'Fajr',
      time: prayerTimes.Fajr,
      timeLeft: `${Math.floor(diff / 3600000)}h ${Math.floor((diff % 3600000) / 60000)}m ${Math.floor((diff % 60000) / 1000)}s`
    });
  }, [prayerTimes, currentTime, playAdhan]);

  useEffect(() => {
    getCurrentLocation();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [getCurrentLocation]);

  useEffect(() => {
    if (location) fetchPrayerTimes();
  }, [location, fetchPrayerTimes]);

  useEffect(() => {
    if (prayerTimes) calculateNextPrayer();
  }, [prayerTimes, currentTime, calculateNextPrayer]);

  // Improved time formatting with Arabic support
  const formatTime = (time24) => {
    const [h, m] = time24.split(':');
    const hour = parseInt(h);
    
    if (language === 'ar') {
      // Arabic: Use ص for morning (AM) and م for evening (PM)
      const isPM = hour >= 12;
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${m} ${isPM ? 'م' : 'ص'}`;
    } else if (language === 'ur') {
      // Urdu: Use شام for evening and صبح for morning
      const isPM = hour >= 12;
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${m} ${isPM ? 'شام' : 'صبح'}`;
    } else {
      // Other languages: Use standard AM/PM
      return `${hour % 12 || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;
    }
  };

  const formatDate = (date) => {
    const day = t.days[date.getDay()];
    const month = t.months[date.getMonth()];
    return isRTL ? `${day}، ${date.getDate()} ${month} ${date.getFullYear()}` : `${day}, ${month} ${date.getDate()}, ${date.getFullYear()}`;
  };

  // Function to get translation for current language
  const getAdhkarTranslation = (adhkarItem) => {
    return adhkarItem[language] || adhkarItem.en; // Fallback to English if translation not available
  };

  // Toggle functions that update both state and localStorage
  const toggleLanguage = (langCode) => {
    setLanguage(langCode);
    setShowLanguageMenu(false);
  };

  const toggleAdhan = () => {
    const newValue = !adhanEnabled;
    setAdhanEnabled(newValue);
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900 pb-24" dir={t.dir}>
      {/* Adhkar Modal */}
      {showAdhkar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className={`bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto ${isRTL ? 'text-right' : ''}`}>
            <div className="sticky top-0 bg-emerald-600 text-white p-6 rounded-t-2xl flex items-center justify-between">
              <h2 className="text-2xl font-bold">{adhkarType === 'morning' ? t.morningAdhkar : t.eveningAdhkar}</h2>
              <button onClick={() => setShowAdhkar(false)} className="p-2 hover:bg-emerald-700 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {adhkarData[adhkarType].map((adhkar, i) => (
                <div key={i} className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border-l-4 border-emerald-600">
                  {/* Arabic Text - Always Displayed */}
                  <div className="mb-4">
                    <p className="text-2xl text-gray-800 leading-relaxed font-arabic text-right" 
                      style={{fontFamily: 'Traditional Arabic, serif', lineHeight: '2'}}>
                      {adhkar.ar}
                    </p>
                  </div>
                  
                  {/* Only show translation if language is NOT Arabic */}
                  {language !== 'ar' && (
                    <>
                      {/* Separator */}
                      <div className="flex items-center my-4">
                        <div className="flex-1 border-t border-emerald-200"></div>
                        <div className="px-3 text-emerald-600 font-semibold text-sm">
                          {t.translation || 'Translation'}
                        </div>
                        <div className="flex-1 border-t border-emerald-200"></div>
                      </div>
                      
                      {/* Translation - Bottom */}
                      <div className={`text-gray-700 leading-relaxed ${isRTL ? 'text-right' : ''}`}>
                        <p className="text-lg" style={{lineHeight: '1.8'}}>
                          {getAdhkarTranslation(adhkar)}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-700 shadow-lg">
        <div className="max-w-md mx-auto px-6 py-6">
          <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Moon className="w-9 h-9 text-amber-300" />
              <h1 className="text-2xl font-bold text-white">{t.prayerTimes}</h1>
            </div>
            <div className="flex gap-2 relative">
              <button 
                onClick={() => setShowLanguageMenu(!showLanguageMenu)} 
                className="p-2.5 hover:bg-emerald-700 rounded-xl transition-colors bg-emerald-800/50"
                aria-label="Change language"
              >
                <Globe className="w-5 h-5 text-amber-200" />
              </button>
              {showLanguageMenu && (
                <div className={`absolute top-12 ${isRTL ? 'left-0' : 'right-0'} bg-white rounded-xl shadow-xl z-50 w-48 border border-emerald-100 py-1`}>
                  {languages.map((lang, i) => (
                    <button 
                      key={lang.code} 
                      onClick={() => toggleLanguage(lang.code)}
                      className={`w-full px-4 py-3 hover:bg-emerald-50 transition-colors text-left ${isRTL ? 'text-right' : ''} ${language === lang.code ? 'bg-emerald-100 font-semibold text-emerald-800' : 'text-gray-700'} ${i === 0 ? 'rounded-t-xl' : ''} ${i === languages.length - 1 ? 'rounded-b-xl' : ''}`}
                    >
                      {lang.native}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Hijri Date - Prominent display */}
          {hijriDate && (
            <div className={`flex items-center justify-center gap-3 bg-amber-900/30 backdrop-blur-sm py-3 px-4 rounded-xl mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Moon className="w-5 h-5 text-amber-300" />
              <span className="text-lg font-bold text-amber-200 text-center">
                {isRTL 
                  ? `${hijriDate.day} ${hijriDate.monthAr} ${hijriDate.year} هـ`
                  : `${hijriDate.day} ${hijriDate.month} ${hijriDate.year} AH`
                }
              </span>
            </div>
          )}
          
          {/* Location and Gregorian Date */}
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <MapPin className="w-4 h-4 text-emerald-200" />
              <span className="text-emerald-100 text-sm">{location?.city}</span>
            </div>
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Calendar className="w-4 h-4 text-emerald-200" />
              <span className="text-emerald-100 text-sm">{formatDate(currentTime)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 py-6">
        {/* Current Time - Modern Design */}
        <div className="text-center mb-6">
          <p className="text-emerald-100 text-sm mb-2 font-medium">{t.currentTime}</p>
          <div className="bg-gradient-to-r from-emerald-800/40 to-teal-800/40 backdrop-blur-sm py-4 px-6 rounded-2xl border border-emerald-700/30">
            <p className="text-white text-3xl font-bold font-mono tracking-wide">
              {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
          </div>
        </div>

        {/* Adhkar Buttons - Top Section */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button 
            onClick={() => { setAdhkarType('morning'); setShowAdhkar(true); }}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white p-4 rounded-xl shadow-lg flex flex-col items-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Sun className="w-6 h-6" />
            <span className="text-xs font-semibold">{t.morningAdhkar}</span>
          </button>
          <button 
            onClick={() => { setAdhkarType('evening'); setShowAdhkar(true); }}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white p-4 rounded-xl shadow-lg flex flex-col items-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Book className="w-6 h-6" />
            <span className="text-xs font-semibold">{t.eveningAdhkar}</span>
          </button>
        </div>

        {/* Next Prayer - Clean Design */}
        {nextPrayer && (
          <div className="bg-gradient-to-r from-emerald-700 to-teal-700 rounded-2xl shadow-xl p-5 mb-6 relative overflow-hidden border border-emerald-600">
            <div className="text-center">
              <p className="text-emerald-100 text-xs mb-1 font-medium tracking-wider">{t.nextPrayer}</p>
              <h2 className="text-3xl font-bold text-white mb-2">{t.prayers[nextPrayer.name]}</h2>
              <div className="text-4xl font-bold text-amber-300 mb-3 font-mono">{formatTime(nextPrayer.time)}</div>
              <div className={`flex items-center justify-center gap-2 text-emerald-100 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Clock className="w-4 h-4" />
                <span className="text-base font-semibold bg-emerald-800/40 py-1.5 px-3 rounded-full">{nextPrayer.timeLeft}</span>
              </div>
            </div>
          </div>
        )}

        {/* Prayer Times - Clean Table */}
        <div className="bg-white/95 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm mb-6">
          {['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((prayer, i) => {
            const isFriday = currentTime.getDay() === 5;
            const displayPrayer = (prayer === 'Dhuhr' && isFriday) ? 'Jumuah' : prayer;
            const isNext = nextPrayer?.name === displayPrayer;
            const isEveningPrayer = ['Maghrib', 'Isha'].includes(prayer);
            
            return (
              <div 
                key={prayer} 
                className={`flex items-center justify-between p-4 transition-all duration-200 ${i !== 5 ? 'border-b border-gray-100' : ''} ${isNext ? 'bg-gradient-to-r from-emerald-50 to-teal-50' : 'hover:bg-gray-50'}`}
              >
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${isNext ? 'bg-emerald-100 text-emerald-600' : isEveningPrayer ? 'bg-purple-100 text-purple-600' : prayer === 'Sunrise' ? 'bg-amber-100 text-amber-600' : 'bg-teal-100 text-teal-600'}`}>
                    {prayer === 'Sunrise' ? (
                      <Sun className="w-5 h-5" />
                    ) : (
                      <Moon className="w-5 h-5" />
                    )}
                  </div>
                  <div className={isRTL ? 'text-right' : ''}>
                    <div className="flex items-center gap-2">
                      <h3 className={`text-base font-semibold ${isNext ? 'text-emerald-800' : 'text-gray-800'}`}>
                        {t.prayers[displayPrayer]}
                      </h3>
                      {prayer === 'Dhuhr' && isFriday && (
                        <span className="text-xs text-emerald-600 font-semibold bg-emerald-100 px-2 py-0.5 rounded-full">
                          {t.fridayPrayer}
                        </span>
                      )}
                    </div>
                    {prayer === 'Sunrise' && (
                      <p className="text-xs text-gray-500 mt-0.5">{t.notPrayerTime}</p>
                    )}
                  </div>
                </div>
                <div className={`text-lg font-bold ${isNext ? 'text-emerald-600' : 'text-gray-700'} ${language === 'ar' ? 'font-arabic' : 'font-mono'}`}>
                  {formatTime(prayerTimes[prayer])}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer with Adhan Settings and Refresh */}
        <div className="mt-6 pt-6 border-t border-emerald-700/30">
          {/* Adhan Settings */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button 
              onClick={toggleAdhan}
              className={`p-3 rounded-xl shadow-lg flex flex-col items-center gap-1.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0 ${adhanEnabled ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white' : 'bg-white/95 text-gray-700'}`}
            >
              {adhanEnabled ? (
                <>
                  <Volume2 className="w-5 h-5" />
                  <span className="text-xs font-semibold">{t.adhanEnabled}</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-5 h-5" />
                  <span className="text-xs font-semibold">{t.adhanDisabled}</span>
                </>
              )}
            </button>
            <button 
              onClick={testAdhan}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white p-3 rounded-xl shadow-lg flex flex-col items-center gap-1.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Volume2 className="w-5 h-5" />
              <span className="text-xs font-semibold">{t.testAdhan}</span>
            </button>
          </div>

          {/* Refresh Button */}
          <button 
            onClick={fetchPrayerTimes}
            className={`w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <Settings className="w-4 h-4" />
            <span className="text-sm">{t.refresh}</span>
          </button>

          {/* Footer Info */}
          <div className="text-center mt-4 text-emerald-100/70 text-xs">
            <p className="mb-0.5">{t.calculationMethod}</p>
            <p>{t.basedOnLocation}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrayerTimesApp;