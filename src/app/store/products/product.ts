import { SafeUrl, SafeHtml } from "@angular/platform-browser";

export interface PFile {
    link: string;
    name: string;
    type: 'link' | 'other' | 'preview';
}

export interface POption {
    currency: 'CAD' | 'USD';
    name: string;
    price: number;
    weight: number;
}

export interface Product {
    category: string;
    description: string | SafeHtml;
    files: any[]
    image: string | SafeUrl;
    name: string;
    options: POption[];
    originalDescription: string;
    originalImage: string;
}
