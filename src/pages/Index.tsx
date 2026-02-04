import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import Icon from '@/components/ui/icon';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Index = () => {
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [agreed, setAgreed] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [filterCapacity, setFilterCapacity] = useState('all');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<string[]>(Array(8).fill(''));
  const [selectedRole, setSelectedRole] = useState('director');

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleQuizAnswer = (answer: string) => {
    const newAnswers = [...quizAnswers];
    newAnswers[currentQuestion] = answer;
    setQuizAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < 7) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const brands = [
    'Fatosa',
    'TALSABELL',
    'MAINCA',
    'NIRO-TECH',
    'Omet',
    'HEBEI XIAOJIN',
    'DARIBO',
    'YES FOOD MACHINERY',
  ];

  const problems = [
    {
      icon: 'TrendingDown',
      title: 'Не вытягивает кг/ч',
      description: 'Срываются отгрузки и контракты',
    },
    {
      icon: 'Thermometer',
      title: 'Фарш перегревается',
      description: 'Брак и жалобы клиентов',
    },
    {
      icon: 'PackageX',
      title: 'Нет запчастей',
      description: 'Простой производственной линии',
    },
    {
      icon: 'Droplets',
      title: 'Сложная мойка',
      description: 'Санитарные риски и штрафы',
    },
    {
      icon: 'Zap',
      title: 'Не совпало по электрике',
      description: 'Переделки и доп. расходы',
    },
  ];

  const advantages = [
    {
      image: 'https://cdn.poehali.dev/projects/bd9048a7-854b-4d3b-a782-386c5097cafc/files/3b82465c-afcd-4254-b9ae-c0389faf7ba9.jpg',
      text: 'Прямые поставки с заводов — фиксируем комплектацию и сроки',
    },
    {
      image: 'https://cdn.poehali.dev/projects/bd9048a7-854b-4d3b-a782-386c5097cafc/files/7256c038-3d31-4484-a7ac-1acb394c7254.jpg',
      text: 'Демозалы МСК/НСК — покажем узлы и обслуживание',
    },
    {
      image: 'https://cdn.poehali.dev/projects/bd9048a7-854b-4d3b-a782-386c5097cafc/files/6daba346-ca07-428c-ac88-849d4a8dd86a.jpg',
      text: 'Подбор под продукт — ножи/решётки/режимы',
    },
    {
      image: 'https://cdn.poehali.dev/projects/bd9048a7-854b-4d3b-a782-386c5097cafc/files/b001e360-62cc-4ac3-b27b-6638fa567113.jpg',
      text: 'Быстрые сроки — под ваш дедлайн',
    },
    {
      image: 'https://cdn.poehali.dev/projects/bd9048a7-854b-4d3b-a782-386c5097cafc/files/0d0f8beb-1ac3-4a9f-a5b2-e264c07a787d.jpg',
      text: 'Сервис — пусконаладка, гарантия, запчасти',
    },
  ];

  const segments = [
    {
      icon: 'Building2',
      title: 'Мясокомбинаты и колбасные цеха',
      description: 'Производительность и снижение простоя',
    },
    {
      icon: 'Package',
      title: 'Полуфабрикаты',
      description: 'Стабильная структура фарша',
    },
    {
      icon: 'Sparkles',
      title: 'Новый цех',
      description: 'Подбор комплекта + требования к подключению',
    },
    {
      icon: 'Rocket',
      title: 'Экстренная замена',
      description: 'Быстрый подбор и запуск',
    },
  ];

  const equipment = [
    {
      brand: 'Fatosa',
      model: 'FW-300',
      capacity: '300 кг/ч',
      type: 'Волчок',
      description: 'Подходит для малых цехов и тестовых партий',
      image: 'https://cdn.poehali.dev/projects/bd9048a7-854b-4d3b-a782-386c5097cafc/files/ae2da679-b284-4a5b-88ef-6348e86708f4.jpg',
    },
    {
      brand: 'TALSABELL',
      model: 'TB-1500',
      capacity: '1500 кг/ч',
      type: 'Волчок',
      description: 'Оптимален для средних производств',
      image: 'https://cdn.poehali.dev/projects/bd9048a7-854b-4d3b-a782-386c5097cafc/files/7b013632-f614-4727-b6df-5b716a8b8008.jpg',
    },
    {
      brand: 'MAINCA',
      model: 'MC-3000',
      capacity: '3000 кг/ч',
      type: 'Куттер',
      description: 'Высокая производительность для крупных комбинатов',
      image: 'https://cdn.poehali.dev/projects/bd9048a7-854b-4d3b-a782-386c5097cafc/files/b001e360-62cc-4ac3-b27b-6638fa567113.jpg',
    },
    {
      brand: 'NIRO-TECH',
      model: 'NT-5000',
      capacity: '5000 кг/ч',
      type: 'Куттер',
      description: 'Промышленная серия для непрерывного цикла',
      image: 'https://cdn.poehali.dev/projects/bd9048a7-854b-4d3b-a782-386c5097cafc/files/ae2da679-b284-4a5b-88ef-6348e86708f4.jpg',
    },
    {
      brand: 'Omet',
      model: 'OM-800',
      capacity: '800 кг/ч',
      type: 'Волчок',
      description: 'Универсальное решение для цехов среднего масштаба',
      image: 'https://cdn.poehali.dev/projects/bd9048a7-854b-4d3b-a782-386c5097cafc/files/7b013632-f614-4727-b6df-5b716a8b8008.jpg',
    },
    {
      brand: 'HEBEI XIAOJIN',
      model: 'HX-10000',
      capacity: '10000 кг/ч',
      type: 'Куттер',
      description: 'Максимальная производительность для крупных предприятий',
      image: 'https://cdn.poehali.dev/projects/bd9048a7-854b-4d3b-a782-386c5097cafc/files/b001e360-62cc-4ac3-b27b-6638fa567113.jpg',
    },
  ];

  const videos = [
    {
      title: 'Разборка и мойка волчка',
      description: 'Как правильно обслуживать оборудование',
      thumbnail: 'https://cdn.poehali.dev/projects/bd9048a7-854b-4d3b-a782-386c5097cafc/files/ae2da679-b284-4a5b-88ef-6348e86708f4.jpg',
    },
    {
      title: 'Работа под нагрузкой 3000 кг/ч',
      description: 'Тест на производительность',
      thumbnail: 'https://cdn.poehali.dev/projects/bd9048a7-854b-4d3b-a782-386c5097cafc/files/7b013632-f614-4727-b6df-5b716a8b8008.jpg',
    },
    {
      title: 'Куттер: однородность фарша',
      description: 'Проверка качества готового продукта',
      thumbnail: 'https://cdn.poehali.dev/projects/bd9048a7-854b-4d3b-a782-386c5097cafc/files/b001e360-62cc-4ac3-b27b-6638fa567113.jpg',
    },
  ];

  const quizQuestions = [
    {
      question: 'Что вы производите?',
      options: ['Колбасы вареные', 'Колбасы сырокопченые', 'Полуфабрикаты', 'Фарш на продажу', 'Деликатесы', 'Другое'],
    },
    {
      question: 'Какой объем в смену (кг)?',
      options: ['До 500', '500–2000', '2000–5000', 'Больше 5000'],
    },
    {
      question: 'Что важнее?',
      options: ['Производительность', 'Качество измельчения', 'Простота мойки', 'Надежность', 'Цена'],
    },
    {
      question: 'Какое сырье?',
      options: ['Охлажденное мясо', 'Замороженные блоки', 'Субпродукты', 'Птица', 'Смешанное'],
    },
    {
      question: 'Есть ли старый волчок/куттер?',
      options: ['Да, работает', 'Да, но не устраивает', 'Нет, покупаем впервые'],
    },
    {
      question: 'Когда нужно?',
      options: ['Срочно (1–2 недели)', 'В течение месяца', 'Планируем на квартал', 'Просто изучаем'],
    },
    {
      question: 'Какой бюджет?',
      options: ['До 500 тыс. ₽', '500 тыс. – 1 млн ₽', '1–3 млн ₽', 'Больше 3 млн ₽', 'Не определились'],
    },
    {
      question: 'Нужна ли помощь в монтаже и запуске?',
      options: ['Да, под ключ', 'Только консультация', 'Справимся сами'],
    },
  ];

  const roleImages = {
    director: 'https://cdn.poehali.dev/projects/bd9048a7-854b-4d3b-a782-386c5097cafc/files/9be876cc-ee50-4ca0-aed7-f30f876fcf0b.jpg',
    engineer: 'https://cdn.poehali.dev/projects/bd9048a7-854b-4d3b-a782-386c5097cafc/files/1926b461-1227-4513-b299-a5095a71fb6b.jpg',
    technologist: 'https://cdn.poehali.dev/projects/bd9048a7-854b-4d3b-a782-386c5097cafc/files/e2dc9c63-5f5e-458e-9a94-211d0762e7b2.jpg',
    purchaser: 'https://cdn.poehali.dev/projects/bd9048a7-854b-4d3b-a782-386c5097cafc/files/cd6d053d-9e27-4b6c-92f1-408a4d0142d2.jpg',
  };

  const faqData = {
    director: [
      {
        question: 'Как быстро окупится новый волчок?',
        answer: 'Окупаемость зависит от объемов производства. При загрузке 2000+ кг/смену современное оборудование окупается за 8-12 месяцев за счет снижения брака и увеличения производительности.',
      },
      {
        question: 'Какие гарантии качества?',
        answer: 'Предоставляем официальную гарантию производителя 12-24 месяца, сервисное обслуживание, запчасти на складе. Все оборудование сертифицировано для пищевого производства.',
      },
      {
        question: 'Можно ли взять в лизинг?',
        answer: 'Да, работаем с ведущими лизинговыми компаниями. Поможем подготовить документы и подобрать оптимальные условия.',
      },
    ],
    engineer: [
      {
        question: 'Какие требования к электрике?',
        answer: 'Зависит от модели: от 380В 16А для малых волчков до 380В 63А для промышленных куттеров. Предоставляем полную техническую документацию и схемы подключения.',
      },
      {
        question: 'Сложно ли обслуживать?',
        answer: 'Современные модели рассчитаны на простое обслуживание. Проводим обучение персонала, предоставляем инструкции по эксплуатации и техническому обслуживанию.',
      },
      {
        question: 'Где брать запчасти?',
        answer: 'Основные запчасти всегда на нашем складе в Москве и Новосибирске. Редкие позиции доставляем от производителя за 7-14 дней.',
      },
    ],
    technologist: [
      {
        question: 'Как подобрать решетку под продукт?',
        answer: 'Зависит от рецептуры: 3-5 мм для вареных колбас, 8-12 мм для рубленых полуфабрикатов. Можем провести тестовое измельчение вашего сырья в демозале.',
      },
      {
        question: 'Не будет ли перегрев фарша?',
        answer: 'Правильно подобранное оборудование и режимы работы обеспечивают температуру фарша не выше 12°C. Куттеры с охлаждением поддерживают до -2°C.',
      },
      {
        question: 'Влияет ли оборудование на структуру?',
        answer: 'Да, критично. Волчки дают грубую структуру, куттеры - эмульсию. Подбираем под конкретный продукт с учетом ножевой группы и скорости вращения.',
      },
    ],
    purchaser: [
      {
        question: 'Какие сроки поставки?',
        answer: 'Популярные модели со склада - 1-3 дня. Под заказ от производителя - 2-6 недель в зависимости от комплектации и страны производства.',
      },
      {
        question: 'Есть ли скидки при опте?',
        answer: 'Да, при комплексных поставках (несколько единиц или полная линия) предоставляем специальные условия. Свяжитесь с менеджером для расчета.',
      },
      {
        question: 'Какие документы для бухгалтерии?',
        answer: 'Полный пакет: договор, счет, УПД, сертификаты соответствия, паспорт оборудования, гарантийный талон. Работаем с НДС и без НДС.',
      },
    ],
  };

  const filteredEquipment = equipment.filter(item => {
    if (filterType !== 'all' && item.type !== filterType) return false;
    if (filterCapacity !== 'all') {
      const capacity = parseInt(item.capacity);
      if (filterCapacity === 'small' && capacity > 1000) return false;
      if (filterCapacity === 'medium' && (capacity <= 1000 || capacity > 5000)) return false;
      if (filterCapacity === 'large' && capacity <= 5000) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-12">
              <img src="https://cdn.poehali.dev/projects/bd9048a7-854b-4d3b-a782-386c5097cafc/bucket/ff23bd6f-4714-405e-a0e1-1a2113cb8aa6.jpg" alt="Техно-Сиб" className="h-12" />
              <nav className="hidden lg:flex items-center gap-6">
                <button onClick={() => scrollToSection('equipment')} className="hover:text-accent transition-colors">
                  Оборудование
                </button>
                <button onClick={() => scrollToSection('advantages')} className="hover:text-accent transition-colors">
                  Преимущества
                </button>
                <button onClick={() => scrollToSection('catalog')} className="hover:text-accent transition-colors">
                  Модели
                </button>
                <button onClick={() => scrollToSection('videos')} className="hover:text-accent transition-colors">
                  Видео
                </button>
                <button onClick={() => scrollToSection('segments')} className="hover:text-accent transition-colors">
                  Квиз
                </button>
                <button onClick={() => scrollToSection('advantages')} className="hover:text-accent transition-colors">
                  Сервис
                </button>
                <button onClick={() => scrollToSection('contacts')} className="hover:text-accent transition-colors">
                  Контакты
                </button>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:block text-right">
                <div className="text-lg font-semibold">8-800-533-82-68</div>
                <div className="text-xs opacity-90">Демозалы: Москва и Новосибирск</div>
              </div>
              <Button variant="secondary" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                Получить КП за 24 часа
              </Button>
            </div>
          </div>
        </div>
      </header>

      <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary to-primary/90 text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url(https://cdn.poehali.dev/projects/bd9048a7-854b-4d3b-a782-386c5097cafc/files/b001e360-62cc-4ac3-b27b-6638fa567113.jpg)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }} />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Промышленные мясорубки, волчки и куттеры от 300–10 000 кг/ч
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-95">
                Прямые поставки от ведущих европейских и азиатских производителей
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <Icon name="CheckCircle2" className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <p className="text-lg">Цена без лишних наценок: поставки напрямую от производителей</p>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="CheckCircle2" className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <p className="text-lg">Проверяем товар перед покупкой. Можем продемонстрировать работу узлов и оборудования в нашем шоуруме в Москве и Новосибирске</p>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="CheckCircle2" className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <p className="text-lg">Гарантируем качество оборудования – услуги пусконаладки, большой склад запчастей, техподдержка</p>
                </div>
              </div>
              <Card className="bg-white shadow-2xl mb-8">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-foreground mb-6">Получить подбор и КП</h3>
                  <form className="space-y-4">
                    <div>
                      <Label htmlFor="hero-name" className="text-foreground">Имя *</Label>
                      <Input
                        id="hero-name"
                        placeholder="Ваше имя"
                        className="mt-2"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="hero-phone" className="text-foreground">Телефон *</Label>
                      <Input
                        id="hero-phone"
                        type="tel"
                        placeholder="+7 (___) ___-__-__"
                        className="mt-2"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div className="flex items-start gap-2">
                      <Checkbox id="hero-agree" checked={agreed} onCheckedChange={(checked) => setAgreed(checked as boolean)} />
                      <label htmlFor="hero-agree" className="text-sm text-muted-foreground cursor-pointer">
                        Я согласен с <a href="#" className="text-accent underline">политикой конфиденциальности</a>
                      </label>
                    </div>
                    <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                      Отправить
                    </Button>
                  </form>
                </CardContent>
              </Card>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 py-6">
                  Подобрать модель
                </Button>
                <Button size="lg" className="border-2 border-primary-foreground bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-lg px-8 py-6 font-semibold">
                  Записаться в демозал
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://cdn.poehali.dev/projects/bd9048a7-854b-4d3b-a782-386c5097cafc/files/6daba346-ca07-428c-ac88-849d4a8dd86a.jpg"
                alt="Промышленное оборудование"
                className="rounded-lg shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="equipment" className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Оборудование от производителей Европы и Китая</h2>
            <p className="text-xl text-muted-foreground">
              Волчки: Германия, Италия, Испания, Польша, Китай. Куттеры: 300–10 000 кг/ч.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {brands.map((brand, index) => (
              <Badge key={index} variant="outline" className="text-base px-6 py-3 hover-scale cursor-pointer border-2">
                {brand}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Наши преимущества
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover-scale overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img
                  src="https://cdn.poehali.dev/projects/bd9048a7-854b-4d3b-a782-386c5097cafc/files/ae2da679-b284-4a5b-88ef-6348e86708f4.jpg"
                  alt="Производительность"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-3">Производительность от 300 до 10 000 кг/ч</h3>
                <p className="text-muted-foreground text-sm">Фактическая производительность нашего оборудования соответствует указанному в КП. Подберём модель под ваш объём и потребности</p>
              </CardContent>
            </Card>
            <Card className="hover-scale overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img
                  src="https://cdn.poehali.dev/projects/bd9048a7-854b-4d3b-a782-386c5097cafc/files/7b013632-f614-4727-b6df-5b716a8b8008.jpg"
                  alt="Качество"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-3">Высокое качество реза</h3>
                <p className="text-muted-foreground text-sm">Гарантируем высокое качество реза, нужную температуру, однородность фарша. Посмотреть модели в наличии можно в наших демозалах в Москве и Новосибирске</p>
              </CardContent>
            </Card>
            <Card className="hover-scale overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img
                  src="https://cdn.poehali.dev/projects/bd9048a7-854b-4d3b-a782-386c5097cafc/files/b001e360-62cc-4ac3-b27b-6638fa567113.jpg"
                  alt="Безопасность"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-3">Легкая разборка и мойка</h3>
                <p className="text-muted-foreground text-sm">Оборудование легко разбирается и моется. Оборудование полностью соответствует требованиям пищевой безопасности и САНПИНам</p>
              </CardContent>
            </Card>
            <Card className="hover-scale overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img
                  src="https://cdn.poehali.dev/projects/bd9048a7-854b-4d3b-a782-386c5097cafc/files/0d0f8beb-1ac3-4a9f-a5b2-e264c07a787d.jpg"
                  alt="Сервис"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-3">Простота в эксплуатации</h3>
                <p className="text-muted-foreground text-sm">Оборудование просто в эксплуатации. В наличие запчасти и консультация наших сервисных специалистов. Осуществляем ПНР при необходимости</p>
              </CardContent>
            </Card>
            <Card className="hover-scale overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img
                  src="https://cdn.poehali.dev/projects/bd9048a7-854b-4d3b-a782-386c5097cafc/files/ae2da679-b284-4a5b-88ef-6348e86708f4.jpg"
                  alt="Тендер"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-3">Пакет документов под тендер</h3>
                <p className="text-muted-foreground text-sm">При необходимости соберём пакет документов под тендер и дадим 2–3 альтернативы по бюджету и срокам</p>
              </CardContent>
            </Card>
            <Card className="hover-scale overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img
                  src="https://cdn.poehali.dev/projects/bd9048a7-854b-4d3b-a782-386c5097cafc/files/7b013632-f614-4727-b6df-5b716a8b8008.jpg"
                  alt="Новый цех"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-3">Подбор комплекта для новых цехов</h3>
                <p className="text-muted-foreground text-sm">Для новых цехов бесплатно сделаем подбор комплекта и дорожную карту запуска</p>
              </CardContent>
            </Card>
            <Card className="hover-scale overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img
                  src="https://cdn.poehali.dev/projects/bd9048a7-854b-4d3b-a782-386c5097cafc/files/b001e360-62cc-4ac3-b27b-6638fa567113.jpg"
                  alt="Гарантия"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-3">Гарантия 12 месяцев</h3>
                <p className="text-muted-foreground text-sm">Полная гарантия на оборудование сроком 12 месяцев с момента запуска</p>
              </CardContent>
            </Card>
            <Card className="hover-scale overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img
                  src="https://cdn.poehali.dev/projects/bd9048a7-854b-4d3b-a782-386c5097cafc/files/0d0f8beb-1ac3-4a9f-a5b2-e264c07a787d.jpg"
                  alt="Доставка"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-3">Доставка по всей России</h3>
                <p className="text-muted-foreground text-sm">Доставка по все России до терминала транспортной компании или Вашего производства</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="advantages" className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Преимущества компании Техно-Сиб как поставщика качественного оборудования для мясного производства
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {advantages.map((advantage, index) => (
              <Card key={index} className="hover-scale overflow-hidden">
                <div className="h-64 overflow-hidden">
                  <img
                    src={advantage.image}
                    alt={advantage.text}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6 text-center">
                  <p className="text-sm leading-relaxed">{advantage.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Как вы получите подходящую модель без покупки вслепую
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="hover-scale">
              <CardContent className="p-6">
                <div className="text-5xl font-bold text-accent mb-4">01</div>
                <h3 className="text-xl font-semibold mb-3">Узнаём задачу</h3>
                <p className="text-muted-foreground">
                  Продукт, кг/ч, сырье, особенности цеха
                </p>
              </CardContent>
            </Card>
            <Card className="hover-scale">
              <CardContent className="p-6">
                <div className="text-5xl font-bold text-accent mb-4">02</div>
                <h3 className="text-xl font-semibold mb-3">Представляем 2–3 варианта оборудования на выбор</h3>
                <p className="text-muted-foreground">
                  Под ваш бюджет и требования
                </p>
              </CardContent>
            </Card>
            <Card className="hover-scale">
              <CardContent className="p-6">
                <div className="text-5xl font-bold text-accent mb-4">03</div>
                <h3 className="text-xl font-semibold mb-3">Показываем в демозале</h3>
                <p className="text-muted-foreground">
                  Можете привезти своё сырье
                </p>
              </CardContent>
            </Card>
            <Card className="hover-scale">
              <CardContent className="p-6">
                <div className="text-5xl font-bold text-accent mb-4">04</div>
                <h3 className="text-xl font-semibold mb-3">Ставим + обучаем</h3>
                <p className="text-muted-foreground">
                  Пусконаладка и инструктаж персонала
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="catalog" className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Каталог оборудования</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Подберите модель по типу и производительности
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Тип" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все типы</SelectItem>
                  <SelectItem value="Волчок">Волчок</SelectItem>
                  <SelectItem value="Куттер">Куттер</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterCapacity} onValueChange={setFilterCapacity}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Производительность" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Любая</SelectItem>
                  <SelectItem value="small">До 1000 кг/ч</SelectItem>
                  <SelectItem value="medium">1000-5000 кг/ч</SelectItem>
                  <SelectItem value="large">Более 5000 кг/ч</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEquipment.map((item, index) => (
              <Card key={index} className="hover-scale overflow-hidden">
                <img src={item.image} alt={item.model} className="w-full h-48 object-cover" />
                <CardContent className="p-6">
                  <Badge className="mb-2 bg-accent text-accent-foreground">{item.brand}</Badge>
                  <h3 className="text-2xl font-bold mb-2">{item.model}</h3>
                  <div className="flex items-center gap-4 mb-3">
                    <Badge variant="outline">{item.type}</Badge>
                    <span className="text-accent font-semibold">{item.capacity}</span>
                  </div>
                  <p className="text-muted-foreground mb-4">{item.description}</p>
                  <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                    Узнать цену
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="videos" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Видео работы оборудования</h2>
            <p className="text-xl text-muted-foreground">
              Смотрите, как оборудование справляется с реальными задачами
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {videos.map((video, index) => (
              <Card key={index} className="hover-scale overflow-hidden cursor-pointer">
                <div className="relative">
                  <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <Icon name="Play" className="w-16 h-16 text-white" />
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{video.title}</h3>
                  <p className="text-muted-foreground">{video.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="segments" className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Подберём волчок/куттер за 3 минуты
            </h2>
            <p className="text-xl text-muted-foreground">
              Ответьте на 8 вопросов — получите 3 модели с ценами
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <Card className="p-8">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Вопрос {currentQuestion + 1} из 8</span>
                  <span className="text-sm font-semibold">{Math.round(((currentQuestion + 1) / 8) * 100)}%</span>
                </div>
                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-accent h-full transition-all duration-300"
                    style={{ width: `${((currentQuestion + 1) / 8) * 100}%` }}
                  />
                </div>
              </div>

              {currentQuestion < 8 ? (
                <>
                  <h3 className="text-2xl font-bold mb-6">{quizQuestions[currentQuestion].question}</h3>
                  <div className="space-y-3 mb-6">
                    {quizQuestions[currentQuestion].options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuizAnswer(option)}
                        className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                          quizAnswers[currentQuestion] === option
                            ? 'border-accent bg-accent/10'
                            : 'border-border hover:border-accent/50'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    {currentQuestion > 0 && (
                      <Button
                        variant="outline"
                        onClick={prevQuestion}
                        className="flex-1"
                      >
                        <Icon name="ChevronLeft" className="w-4 h-4 mr-2" />
                        Назад
                      </Button>
                    )}
                    <Button
                      onClick={nextQuestion}
                      disabled={!quizAnswers[currentQuestion]}
                      className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                    >
                      {currentQuestion === 7 ? 'Получить подборку' : 'Далее'}
                      <Icon name="ChevronRight" className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <Icon name="CheckCircle" className="w-16 h-16 text-accent mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-4">Отлично! Осталось совсем чуть-чуть</h3>
                  <p className="text-muted-foreground mb-6">
                    Оставьте контакты, и мы отправим вам подборку из 2-3 моделей с ценами
                  </p>
                  <form className="space-y-4">
                    <div>
                      <Label htmlFor="quiz-name">Имя *</Label>
                      <Input
                        id="quiz-name"
                        placeholder="Ваше имя"
                        className="mt-2"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="quiz-phone">Телефон *</Label>
                      <Input
                        id="quiz-phone"
                        type="tel"
                        placeholder="+7 (___) ___-__-__"
                        className="mt-2"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div className="flex items-start gap-2">
                      <Checkbox 
                        id="quiz-agree" 
                        checked={agreed} 
                        onCheckedChange={(checked) => setAgreed(checked as boolean)} 
                      />
                      <label htmlFor="quiz-agree" className="text-sm text-muted-foreground cursor-pointer">
                        Я согласен с <a href="#" className="text-accent underline">политикой конфиденциальности</a>
                      </label>
                    </div>
                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                    >
                      Получить подборку
                    </Button>
                  </form>
                </div>
              )}
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Кому мы помогаем</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {segments.map((segment, index) => (
              <Card key={index} className="hover-scale">
                <CardContent className="p-6 text-center">
                  <Icon name={segment.icon} className="w-12 h-12 mx-auto mb-4 text-accent" />
                  <h3 className="text-lg font-semibold mb-2">{segment.title}</h3>
                  <p className="text-sm text-muted-foreground">{segment.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Частые вопросы</h2>
          </div>
          
          <div className="grid md:grid-cols-4 gap-4 mb-12">
            <button
              onClick={() => setSelectedRole('director')}
              className={`relative overflow-hidden rounded-lg transition-all ${
                selectedRole === 'director' ? 'ring-4 ring-accent' : ''
              }`}
            >
              <img 
                src={roleImages.director} 
                alt="Директор" 
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                <span className="text-white font-semibold text-lg">Директор</span>
              </div>
            </button>
            <button
              onClick={() => setSelectedRole('engineer')}
              className={`relative overflow-hidden rounded-lg transition-all ${
                selectedRole === 'engineer' ? 'ring-4 ring-accent' : ''
              }`}
            >
              <img 
                src={roleImages.engineer} 
                alt="Инженер" 
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                <span className="text-white font-semibold text-lg">Инженер</span>
              </div>
            </button>
            <button
              onClick={() => setSelectedRole('technologist')}
              className={`relative overflow-hidden rounded-lg transition-all ${
                selectedRole === 'technologist' ? 'ring-4 ring-accent' : ''
              }`}
            >
              <img 
                src={roleImages.technologist} 
                alt="Технолог" 
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                <span className="text-white font-semibold text-lg">Технолог</span>
              </div>
            </button>
            <button
              onClick={() => setSelectedRole('purchaser')}
              className={`relative overflow-hidden rounded-lg transition-all ${
                selectedRole === 'purchaser' ? 'ring-4 ring-accent' : ''
              }`}
            >
              <img 
                src={roleImages.purchaser} 
                alt="Закупщик" 
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                <span className="text-white font-semibold text-lg">Закупщик</span>
              </div>
            </button>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqData[selectedRole as keyof typeof faqData].map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="bg-background rounded-lg px-6">
                  <AccordionTrigger className="text-left font-semibold hover:text-accent">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <footer id="contacts" className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <img src="https://cdn.poehali.dev/projects/bd9048a7-854b-4d3b-a782-386c5097cafc/bucket/ff23bd6f-4714-405e-a0e1-1a2113cb8aa6.jpg" alt="Техно-Сиб" className="h-12 mb-4" />
              <p className="text-sm opacity-90">
                Поставщик оборудования для мясопереработки
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Контакты</h3>
              <div className="space-y-2 text-sm opacity-90">
                <div>8-800-533-82-68</div>
                <div>info@techno-sib.ru</div>
                <div>Демозалы: Москва и Новосибирск</div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Время работы</h3>
              <div className="space-y-2 text-sm opacity-90">
                <div>Пн-Пт: 9:00 - 18:00</div>
                <div>Сб-Вс: Выходной</div>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-primary-foreground/20 text-center text-sm opacity-90">
            2024 Техно-Сиб. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;