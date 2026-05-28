import { Link } from "@tanstack/react-router";
import { Compass, Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link to="/" className="flex items-center gap-2 font-serif text-2xl font-bold text-primary">
            <Compass className="h-6 w-6 text-gold" />
            <span>بوصلة</span>
          </Link>
          <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">
            منصة الإرشاد النفسي والمهني والكوتشينج للطلبة والخريجين الناطقين بالعربية —
            مبنية على أسس علمية ومعايير دولية معتمدة.
          </p>
        </div>

        <div>
          <h4 className="mb-4 font-serif text-base text-primary">روابط</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/start" className="hover:text-primary">ابدأ رحلتك</Link></li>
            <li><Link to="/pricing" className="hover:text-primary">الأسعار والباقات</Link></li>
            <li><Link to="/institutions" className="hover:text-primary">للمؤسسات (B2B)</Link></li>
            <li><Link to="/booking" className="hover:text-primary">حجز جلسة إرشاد أو كوتشينج</Link></li>
            <li><Link to="/resources" className="hover:text-primary">الموارد والمقالات</Link></li>
            <li><Link to="/about" className="hover:text-primary">عن المنصة</Link></li>
          </ul>
          <h4 className="mb-4 font-serif text-base text-primary">قانوني وتواصل</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link to="/terms" className="hover:text-primary">الشروط والأحكام</Link></li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-gold" /><span>info@bosla.app</span></li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-gold" /><span>+966 50 000 0000</span></li>
          </ul>

            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-gold" /><span>+966 50 000 0000</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} بوصلة® — جميع الحقوق محفوظة. المحتوى والتصاميم والأكواد ملكية فكرية محمية، يُمنع النسخ أو إعادة الاستخدام دون إذن خطي.
      </div>
    </footer>
  );
}
