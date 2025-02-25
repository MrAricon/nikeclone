export interface Product {
    id?: string;
    serialNumber: string;
    name: string;
    price: number;
    description: string;
    category: 'men' | 'women' | 'kids';
    imageUrl: string;
    inStock: boolean;
    colors: string[];
    sizes: string[];
    createdAt?: Date;
    updatedAt?: Date;
}