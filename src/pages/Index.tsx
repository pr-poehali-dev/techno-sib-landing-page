import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import Icon from '@/components/ui/icon';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
  const [catalogTab, setCatalogTab] = useState<'mincers' | 'cutters' | 'blockcutters'>('mincers');
  const [filterBrand, setFilterBrand] = useState('all');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<string[]>(Array(6).fill(''));
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('Получить консультацию');
  const [catalogProducts, setCatalogProducts] = useState<any[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [productImageIndexes, setProductImageIndexes] = useState<{[key: string]: number}>({});
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Загружаем каталог при монтировании компонента
  useEffect(() => {
    loadCatalog();
  }, []);

  const loadCatalog = async () => {
    try {
      setCatalogLoading(true);
      const response = await fetch('https://functions.poehali.dev/91d69da5-6c30-42df-b916-1d740ca6830d?refresh=true');
      const data = await response.json();
      console.log('Catalog loaded:', data.products?.length, 'products');
      console.log('Total images found:', data.total_images_found);
      console.log('Products with images:', data.products_with_images);
      if (data.products?.length > 0) {
        console.log('First product debug params:', data.products[0].debug_all_params);
        console.log('First product images:', data.products[0].additional_images);
        const productsWithImages = data.products.filter((p: any) => p.additional_images && p.additional_images.length > 0);
        console.log('Products with images (frontend count):', productsWithImages.length);
        if (productsWithImages.length > 0) {
          console.log('First product with images:', productsWithImages[0]);
        }
      }
      
      if (data.products) {
        const sortedProducts = data.products.sort((a: any, b: any) => a.price - b.price);
        setCatalogProducts(sortedProducts);
        localStorage.setItem('catalog_data', JSON.stringify({
          products: sortedProducts,
          updated_at: data.updated_at
        }));
      }
    } catch (error) {
      console.error('Ошибка загрузки каталога:', error);
      const cached = localStorage.getItem('catalog_data');
      if (cached) {
        const cachedData = JSON.parse(cached);
        setCatalogProducts(cachedData.products || []);
      }
    } finally {
      setCatalogLoading(false);
    }
  };

  const openProductDetails = (product: any) => {
    setSelectedProduct(product);
    setCurrentImageIndex(0);
    setShowProductModal(true);
  };

  const uniqueBrands = Array.from(new Set(
    catalogProducts
      .map(p => p.params?.find((param: any) => param.name === 'Бренд')?.value)
      .filter(Boolean)
  ));

  const filteredCatalogProducts = catalogProducts
    .filter(product => {
      const allowedCategories = catalogTab === 'cutters' ? [226] : catalogTab === 'blockcutters' ? [220] : [221];
      
      if (!allowedCategories.includes(product.category_id)) return false;

      // Проверяем наличие хотя бы одного param
      if (!product.params || product.params.length === 0) return false;

      if (filterBrand !== 'all') {
        const brandParam = product.params?.find((p: any) => p.name === 'Бренд');
        if (!brandParam || brandParam.value !== filterBrand) return false;
      }

      return true;
    })
    .sort((a, b) => {
      // Товары с ценой (не null и не 0) идут первыми, отсортированы по возрастанию
      // Товары без цены (null или 0) идут после
      const aHasPrice = a.price && a.price > 0;
      const bHasPrice = b.price && b.price > 0;
      
      if (aHasPrice && !bHasPrice) return -1;
      if (!aHasPrice && bHasPrice) return 1;
      if (aHasPrice && bHasPrice) return a.price - b.price;
      return 0;
    });

  const openModal = (title: string) => {
    setModalTitle(title);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({ name: '', phone: '' });
    setAgreed(false);
  };

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
    { name: 'Gazer', logo: 'https://cdn.poehali.dev/files/9c57a067-b2f0-4c95-8318-012ee50fb944.png' },
    { name: 'Fatosa', logo: 'https://cdn.poehali.dev/files/b10fe752-f4c0-4ea4-ac80-e7683cd97287.png' },
    { name: 'Henco', logo: 'https://cdn.poehali.dev/files/84717a41-cef2-4ca7-97ff-5073deb58da1.png' },
    { name: 'International Clip', logo: 'https://cdn.poehali.dev/files/b6488a7b-a8e0-43f5-96d0-61a1a97d11f7.png' },
    { name: 'Niro-Tech', logo: 'https://cdn.poehali.dev/files/1fa320d6-e9dc-4e65-be4a-2faf9c602144.png' },
    { name: 'Nock', logo: 'https://cdn.poehali.dev/files/cac69f33-0c76-4317-a28c-a4f5a515ff40.png' },
    { name: 'Mainca', logo: 'https://cdn.poehali.dev/files/71242292-f18f-45f1-9258-3d879a366c74.png' },
    { name: 'Daribo', logo: 'https://cdn.poehali.dev/files/bef4bdb4-44e1-48f9-a01b-4b441157841d.png' },
    { name: 'ABM', logo: 'https://cdn.poehali.dev/files/c37bd5b5-f492-4141-a154-b651f8bee65d.png' },
    { name: 'Bomeda', logo: 'https://cdn.poehali.dev/files/52dac093-e152-4fff-8bd4-ffe334a36a35.png' },
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
      image: 'https://cdn.poehali.dev/files/7f8f0530-fd16-4245-8986-d11ddcdd92fc.jpg',
      text: 'Прямые поставки с заводов — фиксируем комплектацию и сроки',
    },
    {
      image: 'https://cdn.poehali.dev/files/75a90c8e-cf4d-4083-9f9d-46ee193294e9.jpg',
      text: 'Демозалы МСК/НСК — покажем узлы и обслуживание',
    },
    {
      image: 'https://cdn.poehali.dev/files/f680aa79-8524-4587-9a3b-bcccb9d21b0e.jpg',
      text: 'Подбор под продукт — ножи/решётки/режимы',
    },
    {
      image: 'https://cdn.poehali.dev/files/a8fe2f0a-ce7b-4fa5-ae2b-61a7b321a961.jpg',
      text: 'Быстрые сроки — под ваш дедлайн',
    },
    {
      image: 'https://cdn.poehali.dev/files/4446cab2-d3e5-4982-8640-cf84aee6d898.jpg',
      text: 'Сервис — пусконаладка, гарантия, запчасти',
    },
  ];

  const segments = [
    {
      icon: 'Building2',
      image: 'https://cdn.poehali.dev/projects/bd9048a7-854b-4d3b-a782-386c5097cafc/files/ae2da679-b284-4a5b-88ef-6348e86708f4.jpg',
      title: 'Мясокомбинаты и колбасные цеха',
      description: 'Производительность и снижение простоя',
    },
    {
      icon: 'Package',
      image: 'https://cdn.poehali.dev/projects/bd9048a7-854b-4d3b-a782-386c5097cafc/files/7b013632-f614-4727-b6df-5b716a8b8008.jpg',
      title: 'Полуфабрикаты',
      description: 'Стабильная структура фарша',
    },
    {
      icon: 'Sparkles',
      image: 'https://cdn.poehali.dev/projects/bd9048a7-854b-4d3b-a782-386c5097cafc/files/b001e360-62cc-4ac3-b27b-6638fa567113.jpg',
      title: 'Новый цех',
      description: 'Подбор комплекта + требования к подключению',
    },
    {
      icon: 'Rocket',
      image: 'https://cdn.poehali.dev/projects/bd9048a7-854b-4d3b-a782-386c5097cafc/files/0d0f8beb-1ac3-4a9f-a5b2-e264c07a787d.jpg',
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
      title: 'Волчок Daribo JR-120',
      description: 'Демонстрация работы промышленного волчка',
      videoId: 'e9f5748185b428a295be966c7cbb4e1e',
    },
    {
      title: 'Волчок для измельчения мяса двухшнековый JR 130',
      description: 'Двухшнековая система измельчения',
      videoId: '9066f6b113d8967fa0176f717094c6d1',
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

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4 lg:gap-12">
              <div className="flex flex-col gap-1">
                <img src="https://cdn.poehali.dev/projects/bd9048a7-854b-4d3b-a782-386c5097cafc/bucket/ff23bd6f-4714-405e-a0e1-1a2113cb8aa6.jpg" alt="Техно-Сиб" className="h-8 md:h-10 lg:h-12" />
                <a href="tel:88005338268" className="text-sm lg:hidden font-bold whitespace-nowrap">8-800-533-82-68</a>
              </div>
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
                <button onClick={() => scrollToSection('about')} className="hover:text-accent transition-colors">
                  О компании
                </button>
                <button onClick={() => scrollToSection('contacts')} className="hover:text-accent transition-colors">
                  Контакты
                </button>
              </nav>
            </div>
            <div className="hidden lg:flex flex-col items-end gap-2">
              <Button variant="secondary" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold" onClick={() => openModal('Получить КП за 24 часа')}>
                Получить КП за 24 часа
              </Button>
              <div className="text-lg font-bold">8-800-533-82-68</div>
            </div>
            <div className="flex lg:hidden items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden text-primary-foreground hover:bg-primary-foreground/10 p-2"
              >
                <Icon name={mobileMenuOpen ? "X" : "Menu"} className="w-12 h-12" />
              </Button>
            </div>
          </div>
          {mobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-primary-foreground/20 animate-in slide-in-from-top">
              <nav className="flex flex-col gap-4">
                <button onClick={() => { scrollToSection('equipment'); setMobileMenuOpen(false); }} className="text-left hover:text-accent transition-colors py-2">
                  Оборудование
                </button>
                <button onClick={() => { scrollToSection('advantages'); setMobileMenuOpen(false); }} className="text-left hover:text-accent transition-colors py-2">
                  Преимущества
                </button>
                <button onClick={() => { scrollToSection('catalog'); setMobileMenuOpen(false); }} className="text-left hover:text-accent transition-colors py-2">
                  Модели
                </button>
                <button onClick={() => { scrollToSection('videos'); setMobileMenuOpen(false); }} className="text-left hover:text-accent transition-colors py-2">
                  Видео
                </button>
                <button onClick={() => { scrollToSection('segments'); setMobileMenuOpen(false); }} className="text-left hover:text-accent transition-colors py-2">
                  Квиз
                </button>
                <button onClick={() => { scrollToSection('about'); setMobileMenuOpen(false); }} className="text-left hover:text-accent transition-colors py-2">
                  О компании
                </button>
                <button onClick={() => { scrollToSection('contacts'); setMobileMenuOpen(false); }} className="text-left hover:text-accent transition-colors py-2">
                  Контакты
                </button>
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold mt-2" onClick={() => { openModal('Получить КП за 24 часа'); setMobileMenuOpen(false); }}>
                  Получить КП за 24 часа
                </Button>
              </nav>
            </div>
          )}
        </div>
      </header>



      <section className="relative pt-2 pb-6 md:pt-4 md:pb-8 bg-gradient-to-br from-secondary via-background to-secondary overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <Card className="overflow-hidden shadow-2xl bg-white relative">
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="absolute inset-0 lg:hidden">
                  <img
                    src="https://cdn.poehali.dev/files/8fa852c0-3557-45b7-a0cc-3d2d7ff3eecc.jpg"
                    alt="Промышленная мясорубка"
                    className="w-full h-full object-cover opacity-20"
                  />
                </div>
                <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center relative z-10">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-foreground">
                    Промышленные мясорубки, волчки, куттеры и блокорезки
                  </h1>
                  <p className="text-xl md:text-2xl mb-8 text-muted-foreground">
                    Прямые поставки от ведущих европейских и азиатских производителей
                  </p>
                  <div className="space-y-4 mb-8">
                    <div className="flex items-start gap-3">
                      <Icon name="CheckCircle2" className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                      <p className="text-lg text-foreground"><strong>От 300 до 10 000 кг/ч</strong> — модели для любых объёмов производства</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Icon name="CheckCircle2" className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                      <p className="text-lg text-foreground"><strong>Цена от производителя</strong></p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Icon name="CheckCircle2" className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                      <p className="text-lg text-foreground"><strong>Проверяем перед покупкой:</strong> демонстрация работы в шоурумах Москвы и Новосибирска</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Icon name="CheckCircle2" className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                      <p className="text-lg text-foreground"><strong>Гарантия качества:</strong> пусконаладка, запчасти на складе, техподдержка</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <Button size="lg" onClick={() => openModal('Подобрать модель')} className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 py-6">
                      Подобрать модель
                    </Button>
                    <Button size="lg" onClick={() => openModal('Записаться в демозал')} className="border-2 border-primary bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6 font-semibold">
                      Записаться в демозал
                    </Button>
                  </div>
                </div>
                <div className="relative min-h-[400px] lg:min-h-[600px] overflow-hidden hidden lg:block">
                  <img
                    src="https://cdn.poehali.dev/files/8fa852c0-3557-45b7-a0cc-3d2d7ff3eecc.jpg"
                    alt="Промышленная мясорубка"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section id="equipment" className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Оборудование от производителей Европы и Китая</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-8 items-center">
            {brands.map((brand, index) => (
              <div key={index} className="hover-scale cursor-pointer p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <img 
                  src={brand.logo} 
                  alt={brand.name} 
                  className="h-16 w-auto object-contain"
                />
              </div>
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
                  src="https://cdn.poehali.dev/projects/bd9048a7-854b-4d3b-a782-386c5097cafc/bucket/a656d1db-92e4-4e11-b350-30a9c05cd111.png"
                  alt="Производительность"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="font-bold text-2xl mb-4">Производительность от 300 до 10 000 кг/ч</h3>
                <p className="text-muted-foreground text-lg">Фактическая производительность нашего оборудования соответствует указанному в КП. Подберём модель под ваш объём и потребности</p>
              </CardContent>
            </Card>
            <Card className="hover-scale overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img
                  src="https://cdn.poehali.dev/projects/bd9048a7-854b-4d3b-a782-386c5097cafc/bucket/bed77bb8-4a4c-4bac-988f-5c0eb703091a.png"
                  alt="Качество"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="font-bold text-2xl mb-4">Высокое качество реза</h3>
                <p className="text-muted-foreground text-lg">Гарантируем высокое качество реза, нужную температуру, однородность фарша. Посмотреть модели в наличии можно в наших демозалах в Москве и Новосибирске</p>
              </CardContent>
            </Card>
            <Card className="hover-scale overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img
                  src="https://cdn.poehali.dev/projects/bd9048a7-854b-4d3b-a782-386c5097cafc/bucket/d79ae1f9-3f66-4af2-8599-343067d6212b.png"
                  alt="Легкая разборка и мойка"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="font-bold text-2xl mb-4">Легкая разборка и мойка</h3>
                <p className="text-muted-foreground text-lg">Оборудование легко разбирается и моется. Оборудование полностью соответствует требованиям пищевой безопасности и САНПИНам</p>
              </CardContent>
            </Card>
            <Card className="hover-scale overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img
                  src="https://cdn.poehali.dev/files/af41be1d-7065-4660-a7f1-6567210128a2.jpg"
                  alt="Сервис"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="font-bold text-2xl mb-4">Простота в эксплуатации</h3>
                <p className="text-muted-foreground text-lg">Оборудование просто в эксплуатации. В наличие запчасти и консультация наших сервисных специалистов. Осуществляем ПНР при необходимости</p>
              </CardContent>
            </Card>
            <Card className="hover-scale overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img
                  src="https://cdn.poehali.dev/files/67e88add-8208-4a74-8b09-d961c8342aaa.jpg"
                  alt="Тендер"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="font-bold text-2xl mb-4">Пакет документов под тендер</h3>
                <p className="text-muted-foreground text-lg">При необходимости соберём пакет документов под тендер и дадим 2–3 альтернативы по бюджету и срокам</p>
              </CardContent>
            </Card>
            <Card className="hover-scale overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img
                  src="https://cdn.poehali.dev/files/05762f59-4181-43a4-89df-0ecccd3bc538.jpg"
                  alt="Новый цех"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="font-bold text-2xl mb-4">Подбор комплекта для новых цехов</h3>
                <p className="text-muted-foreground text-lg">Для новых цехов бесплатно сделаем подбор комплекта и дорожную карту запуска</p>
              </CardContent>
            </Card>
            <Card className="hover-scale overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img
                  src="https://cdn.poehali.dev/files/4be4da39-895e-4165-b9c5-d36d803964ad.jpg"
                  alt="Гарантия"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="font-bold text-2xl mb-4">Гарантия 12 месяцев</h3>
                <p className="text-muted-foreground text-lg">Полная гарантия на оборудование сроком 12 месяцев с момента запуска</p>
              </CardContent>
            </Card>
            <Card className="hover-scale overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img
                  src="https://cdn.poehali.dev/files/ab57a59c-7aaf-4ca3-8757-de0810a446c9.jpg"
                  alt="Доставка"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="font-bold text-2xl mb-4">Доставка по всей России</h3>
                <p className="text-muted-foreground text-lg">Доставка по все России до терминала транспортной компании или Вашего производства</p>
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
            
            <div className="flex flex-col sm:flex-row justify-center gap-2 mb-8 px-4">
              <Button
                size="lg"
                onClick={() => setCatalogTab('mincers')}
                className={`w-full sm:w-auto ${catalogTab === 'mincers' ? 'bg-accent text-accent-foreground' : 'bg-secondary text-foreground hover:bg-accent/20'}`}
              >
                Мясорубки/Волчки
              </Button>
              <Button
                size="lg"
                onClick={() => setCatalogTab('cutters')}
                className={`w-full sm:w-auto ${catalogTab === 'cutters' ? 'bg-accent text-accent-foreground' : 'bg-secondary text-foreground hover:bg-accent/20'}`}
              >
                Куттеры
              </Button>
              <Button
                size="lg"
                onClick={() => setCatalogTab('blockcutters')}
                className={`w-full sm:w-auto ${catalogTab === 'blockcutters' ? 'bg-accent text-accent-foreground' : 'bg-secondary text-foreground hover:bg-accent/20'}`}
              >
                Блокорезки
              </Button>
            </div>


          </div>
          {catalogLoading ? (
            <div className="text-center py-12">
              <Icon name="Loader2" className="w-12 h-12 text-accent animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Загрузка каталога...</p>
            </div>
          ) : filteredCatalogProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Товары не найдены</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCatalogProducts.map((product) => (
                <Card key={product.id} className="hover-scale overflow-hidden flex flex-col">
                  {product.additional_images && product.additional_images.length > 0 ? (
                    <div className="relative w-full h-56 bg-secondary group">
                      <img 
                        src={product.additional_images[productImageIndexes[product.id] || 0] || product.picture} 
                        alt={product.name} 
                        className="w-full h-full object-contain cursor-pointer"
                        onClick={() => {
                          setLightboxImages(product.additional_images);
                          setLightboxIndex(productImageIndexes[product.id] || 0);
                          setLightboxOpen(true);
                        }}
                      />
                      {product.additional_images.length > 1 && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const currentIndex = productImageIndexes[product.id] || 0;
                              const newIndex = currentIndex === 0 ? product.additional_images.length - 1 : currentIndex - 1;
                              setProductImageIndexes(prev => ({...prev, [product.id]: newIndex}));
                            }}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Icon name="ChevronLeft" className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const currentIndex = productImageIndexes[product.id] || 0;
                              const newIndex = currentIndex === product.additional_images.length - 1 ? 0 : currentIndex + 1;
                              setProductImageIndexes(prev => ({...prev, [product.id]: newIndex}));
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Icon name="ChevronRight" className="w-4 h-4" />
                          </button>
                          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                            {product.additional_images.map((_: any, idx: number) => (
                              <button
                                key={idx}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setProductImageIndexes(prev => ({...prev, [product.id]: idx}));
                                }}
                                className={`w-2 h-2 rounded-full transition-all ${
                                  idx === (productImageIndexes[product.id] || 0) 
                                    ? 'bg-accent w-6' 
                                    : 'bg-white/60 hover:bg-white/80'
                                }`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <img 
                      src={product.picture} 
                      alt={product.name} 
                      className="w-full h-56 object-contain bg-secondary cursor-pointer"
                      onClick={() => {
                        setLightboxImages([product.picture]);
                        setLightboxIndex(0);
                        setLightboxOpen(true);
                      }}
                    />
                  )}
                  <CardContent className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold mb-3 line-clamp-2">{product.name}</h3>
                    {product.price && product.price > 0 && (
                      <div className="mb-4">
                        <span className="text-2xl font-bold text-accent">от {Math.round(product.price).toLocaleString('ru-RU')} ₽</span>
                      </div>
                    )}
                    {product.params_preview && product.params_preview.length > 0 && (
                      <div className="mb-4 space-y-1">
                        {product.params_preview.map((param: any, idx: number) => (
                          <div key={idx} className="text-sm">
                            <span className="text-muted-foreground">{param.name}:</span>{' '}
                            <span className="font-medium">{param.value}{param.unit ? ` ${param.unit}` : ''}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="mt-auto space-y-2">
                      <Button 
                        size="lg"
                        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-base px-8 py-4" 
                        onClick={() => openProductDetails(product)}
                      >
                        Смотреть подробнее
                      </Button>
                      <Button 
                        size="lg"
                        variant="outline"
                        className="w-full bg-secondary hover:bg-secondary/80 text-foreground border-2 border-accent font-bold text-base px-8 py-4" 
                        onClick={() => openModal('Запросить КП')}
                      >
                        Запросить КП
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="advantages" className="py-20">
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
                  <p className="text-lg leading-relaxed font-medium">{advantage.text}</p>
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
              Как мы работаем
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

      <section id="videos" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Видео работы оборудования</h2>
            <p className="text-xl text-muted-foreground">
              Смотрите, как оборудование справляется с реальными задачами
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {videos.map((video, index) => (
              <Card key={index} className="hover-scale overflow-hidden">
                <div className="relative aspect-video bg-black">
                  <iframe
                    src={`https://rutube.ru/play/embed/${video.videoId}`}
                    frameBorder="0"
                    allow="clipboard-write; autoplay"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
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
              Ответьте на 5 вопросов — получите 3 модели с ценами
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <Card className="p-8">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Вопрос {currentQuestion + 1} из 5</span>
                  <span className="text-sm font-semibold">{Math.round(((currentQuestion + 1) / 5) * 100)}%</span>
                </div>
                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-accent h-full transition-all duration-300"
                    style={{ width: `${((currentQuestion + 1) / 5) * 100}%` }}
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
                      {currentQuestion === 4 ? 'Получить подборку' : 'Далее'}
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
                      type="button"
                      size="lg" 
                      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                      onClick={() => openModal('Получить подборку')}
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

      <section id="about" className="py-20 bg-gradient-to-b from-secondary to-background">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">О компании ТЕХНО-СИБ</h2>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="hover-scale text-center p-6">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Calendar" className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">25 лет на рынке</h3>
              <p className="text-muted-foreground">Опыт работы с 2001 года</p>
            </Card>

            <Card className="hover-scale text-center p-6">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="MapPin" className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">2 города</h3>
              <p className="text-muted-foreground">Офисы в Москве и Новосибирске</p>
            </Card>

            <Card className="hover-scale text-center p-6">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Globe" className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">Проверенные партнеры</h3>
              <p className="text-muted-foreground">Из Европы, России и Китая</p>
            </Card>
          </div>

          <Card className="p-8 md:p-12 shadow-lg">
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Компания <strong className="text-foreground">«Техно-Сиб»</strong> — надежный поставщик и партнер в сфере профессионального пищевого и фасовочно-упаковочного оборудования. Мы работаем с 2001 года и уже 25 лет помогаем предприятиям эффективно оснащать производства и склады пищевым и упаковочным оборудованием, предоставляем сервисное обслуживание, а также реализуем упаковочные и расходные материалы.
            </p>

            <div className="border-l-4 border-accent bg-accent/5 p-6 my-6">
              <p className="text-lg font-medium text-foreground">
                Мы сотрудничаем с ведущими заводами-производителями Европы, России и Китая, подбирая решения под задачи и бюджет клиента.
              </p>
            </div>

            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Собственные офисы продаж, склады, сервисная служба и отлаженная логистика в Москве и Новосибирске позволяют нам оперативно выполнять поставки и поддерживать оборудование на территории России и стран СНГ.
            </p>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Экспертиза наших специалистов помогает решать задачи любого уровня сложности — от подбора единичной позиции до комплексного оснащения. <strong className="text-foreground">«Техно-Сиб»</strong> всегда предложит оптимальное решение для вашего бизнеса и обеспечит надежную поддержку на всех этапах работы.
            </p>

            <div className="border-t border-border pt-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex gap-3">
                  <Icon name="CheckCircle2" className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Комплексные решения</h4>
                    <p className="text-muted-foreground">От подбора оборудования до сервисного обслуживания</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Icon name="CheckCircle2" className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Быстрая доставка</h4>
                    <p className="text-muted-foreground">Собственная логистика по всей России и СНГ</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Icon name="CheckCircle2" className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Сервисная поддержка</h4>
                    <p className="text-muted-foreground">Гарантийное и постгарантийное обслуживание</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Icon name="CheckCircle2" className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-foreground mb-1">Экспертная консультация</h4>
                    <p className="text-muted-foreground">Помощь в выборе оптимального решения</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section id="faq" className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Частые вопросы</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="overflow-hidden">
              <img 
                src="https://cdn.poehali.dev/projects/bd9048a7-854b-4d3b-a782-386c5097cafc/files/a58b4558-9697-4b42-845a-ab0e50aa74f2.jpg"
                alt="Директор" 
                className="w-full h-80 object-cover"
              />
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 text-center">Директор</h3>
                <Accordion type="single" collapsible className="space-y-2">
                  {faqData.director.map((faq, index) => (
                    <AccordionItem key={index} value={`director-${index}`}>
                      <AccordionTrigger className="text-left text-base font-semibold hover:text-accent">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-base text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <img 
                src="https://cdn.poehali.dev/projects/bd9048a7-854b-4d3b-a782-386c5097cafc/files/9ec9ea66-abef-4e2e-a9bf-b82e196cbce2.jpg"
                alt="Инженер" 
                className="w-full h-80 object-cover"
              />
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 text-center">Инженер</h3>
                <Accordion type="single" collapsible className="space-y-2">
                  {faqData.engineer.map((faq, index) => (
                    <AccordionItem key={index} value={`engineer-${index}`}>
                      <AccordionTrigger className="text-left text-base font-semibold hover:text-accent">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-base text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <img 
                src="https://cdn.poehali.dev/projects/bd9048a7-854b-4d3b-a782-386c5097cafc/files/4974227d-c3cb-40b4-94ce-7110037b6903.jpg"
                alt="Технолог" 
                className="w-full h-80 object-cover"
              />
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 text-center">Технолог</h3>
                <Accordion type="single" collapsible className="space-y-2">
                  {faqData.technologist.map((faq, index) => (
                    <AccordionItem key={index} value={`technologist-${index}`}>
                      <AccordionTrigger className="text-left text-base font-semibold hover:text-accent">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-base text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <img 
                src="https://cdn.poehali.dev/files/f3a36fe9-687f-472f-8975-05956c9827c2.jpg"
                alt="Закупщик" 
                className="w-full h-80 object-cover"
              />
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 text-center">Закупщик</h3>
                <Accordion type="single" collapsible className="space-y-2">
                  {faqData.purchaser.map((faq, index) => (
                    <AccordionItem key={index} value={`purchaser-${index}`}>
                      <AccordionTrigger className="text-left text-base font-semibold hover:text-accent">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-base text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-accent/20 via-background to-accent/10">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="p-8 md:p-12 shadow-2xl">
              <div className="text-center mb-8">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">Оставить заявку</h2>
                <p className="text-xl text-muted-foreground">
                  Получите консультацию специалиста и подборку оборудования под ваши задачи
                </p>
              </div>
              <form className="space-y-6">
                <div>
                  <Label htmlFor="request-name" className="text-lg">Имя *</Label>
                  <Input
                    id="request-name"
                    placeholder="Ваше имя"
                    className="mt-2 text-lg p-6"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="request-phone" className="text-lg">Телефон *</Label>
                  <Input
                    id="request-phone"
                    type="tel"
                    placeholder="+7 (___) ___-__-__"
                    className="mt-2 text-lg p-6"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="flex items-start gap-3">
                  <Checkbox 
                    id="request-agree" 
                    checked={agreed} 
                    onCheckedChange={(checked) => setAgreed(checked as boolean)} 
                  />
                  <label htmlFor="request-agree" className="text-base cursor-pointer">
                    Я согласен с <a href="#" className="text-accent underline">политикой конфиденциальности</a>
                  </label>
                </div>
                <Button 
                  type="button"
                  size="lg" 
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-lg py-6"
                  onClick={() => openModal('Оставить заявку')}
                >
                  Отправить заявку
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>

      <footer id="contacts" className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <img src="https://cdn.poehali.dev/projects/bd9048a7-854b-4d3b-a782-386c5097cafc/bucket/ff23bd6f-4714-405e-a0e1-1a2113cb8aa6.jpg" alt="Техно-Сиб Групп" className="h-12 mb-4" />
              <p className="text-sm opacity-90">
                Поставщик оборудования для мясопереработки
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Контакты</h3>
              <div className="space-y-2 text-sm opacity-90">
                <div>8-800-533-82-68</div>
                <div>info@t-sib.ru</div>
                <div>Демозалы: Москва и Новосибирск</div>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-primary-foreground/20 text-center text-sm opacity-90">
            2026 Техно-Сиб Групп. Все права защищены.
          </div>
        </div>
      </footer>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{modalTitle}</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); }} className="space-y-4">
            <div>
              <Label htmlFor="modal-name">Имя *</Label>
              <Input
                id="modal-name"
                placeholder="Ваше имя"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="modal-phone">Телефон *</Label>
              <Input
                id="modal-phone"
                type="tel"
                placeholder="+7 (___) ___-__-__"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="flex items-start gap-2">
              <Checkbox id="modal-agree" checked={agreed} onCheckedChange={(checked) => setAgreed(checked as boolean)} />
              <label htmlFor="modal-agree" className="text-sm cursor-pointer">
                Я согласен с <a href="#" className="text-accent underline">политикой конфиденциальности</a>
              </label>
            </div>
            <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
              Отправить
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showProductModal} onOpenChange={setShowProductModal}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedProduct.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                {selectedProduct.additional_images && selectedProduct.additional_images.length > 0 ? (
                  <div className="relative">
                    <div className="relative w-full h-80 bg-secondary rounded-lg overflow-hidden">
                      <img 
                        src={selectedProduct.additional_images[currentImageIndex] || selectedProduct.picture} 
                        alt={selectedProduct.name} 
                        className="w-full h-full object-contain cursor-pointer"
                        onClick={() => {
                          setLightboxImages(selectedProduct.additional_images);
                          setLightboxIndex(currentImageIndex);
                          setLightboxOpen(true);
                        }}
                      />
                    </div>
                    {selectedProduct.additional_images.length > 1 && (
                      <>
                        <button
                          onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? selectedProduct.additional_images.length - 1 : prev - 1))}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
                        >
                          <Icon name="ChevronLeft" className="w-6 h-6" />
                        </button>
                        <button
                          onClick={() => setCurrentImageIndex((prev) => (prev === selectedProduct.additional_images.length - 1 ? 0 : prev + 1))}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
                        >
                          <Icon name="ChevronRight" className="w-6 h-6" />
                        </button>
                        <div className="flex justify-center gap-2 mt-4">
                          {selectedProduct.additional_images.map((_: any, idx: number) => (
                            <button
                              key={idx}
                              onClick={() => setCurrentImageIndex(idx)}
                              className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-accent w-8' : 'bg-gray-300'}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <img 
                    src={selectedProduct.picture} 
                    alt={selectedProduct.name} 
                    className="w-full h-80 object-contain rounded-lg bg-secondary cursor-pointer"
                    onClick={() => {
                      setLightboxImages([selectedProduct.picture]);
                      setLightboxIndex(0);
                      setLightboxOpen(true);
                    }}
                  />
                )}
                
                {selectedProduct.price && selectedProduct.price > 0 && (
                  <div>
                    <h3 className="text-3xl font-bold text-accent mb-4">
                      от {Math.round(selectedProduct.price).toLocaleString('ru-RU')} ₽
                    </h3>
                  </div>
                )}

                {selectedProduct.params_full && selectedProduct.params_full.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Характеристики</h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {selectedProduct.params_full.map((param: any, idx: number) => (
                        <div key={idx} className="text-sm border-b pb-2">
                          <span className="text-muted-foreground">{param.name}:</span>{' '}
                          <span className="font-medium">{param.value}{param.unit ? ` ${param.unit}` : ''}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedProduct.description && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Описание</h3>
                    <div 
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: selectedProduct.description }}
                    />
                  </div>
                )}

                <div className="pt-4 border-t">
                  <Button 
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                    onClick={() => {
                      setShowProductModal(false);
                      openModal('Запросить КП на ' + selectedProduct.name);
                    }}
                  >
                    Запросить коммерческое предложение
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="sm:max-w-[90vw] max-w-[95vw] h-[90vh] p-0 bg-black/95">
          <div className="relative w-full h-full flex items-center justify-center">
            <img 
              src={lightboxImages[lightboxIndex]} 
              alt="Увеличенное изображение" 
              className="max-w-full max-h-full object-contain"
            />
            {lightboxImages.length > 1 && (
              <>
                <button
                  onClick={() => setLightboxIndex((prev) => (prev === 0 ? lightboxImages.length - 1 : prev - 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-xl z-10"
                >
                  <Icon name="ChevronLeft" className="w-8 h-8" />
                </button>
                <button
                  onClick={() => setLightboxIndex((prev) => (prev === lightboxImages.length - 1 ? 0 : prev + 1))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-xl z-10"
                >
                  <Icon name="ChevronRight" className="w-8 h-8" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {lightboxImages.map((_: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setLightboxIndex(idx)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        idx === lightboxIndex 
                          ? 'bg-white w-8' 
                          : 'bg-white/50 hover:bg-white/80'
                      }`}
                    />
                  ))}
                </div>
                <div className="absolute top-4 right-4 text-white text-lg font-semibold bg-black/50 px-4 py-2 rounded-full">
                  {lightboxIndex + 1} / {lightboxImages.length}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;