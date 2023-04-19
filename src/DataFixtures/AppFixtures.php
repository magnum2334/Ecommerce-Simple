<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

use App\Entity\Category;
use App\Entity\Products;
use App\Entity\Customer;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        // $product = new Product();

        $category = new Category();
        $categoryNames = ['Electrodomésticos', 'Licuadoras', 'Ollas', 'Cuchillos', 'Repuestos'];
        // Crear una lista de productos
        $productsList = [
            [
                'title' => 'Licuadora profesional',
                'description' => 'Licuadora de alta potencia con 8 cuchillas de acero inoxidable.',
                'code' => 'LP001',
                'price' => 199.99,
                'stock' => 20,
                'status' => true,
                'category' => $categoryNames[1]
            ],
            [
                'title' => 'Olla express',
                'description' => 'Olla de aluminio de 8 litros para cocinar en tiempo récord.',
                'code' => 'OE001',
                'price' => 69.99,
                'stock' => 15,
                'status' => true,
                'category' => $categoryNames[2]
            ],
            [
                'title' => 'Set de cuchillos',
                'description' => 'Set de 3 cuchillos profesionales de acero inoxidable con funda protectora.',
                'code' => 'CKS001',
                'price' => 59.99,
                'stock' => 30,
                'status' => true,
                'category' => $categoryNames[3]
            ],
            [
                'title' => 'Filtro de aire HEPA',
                'description' => 'Filtro de aire HEPA de alta eficiencia para aspiradoras.',
                'code' => 'FH001',
                'price' => 19.99,
                'stock' => 50,
                'status' => true,
                'category' => $categoryNames[4]
            ],
            [
                'title' => 'Batidora de mano',
                'description' => 'Batidora de mano con 5 velocidades y accesorios para mezclar, batir y amasar.',
                'code' => 'BM001',
                'price' => 89.99,
                'stock' => 10,
                'status' => true,
                'category' => $categoryNames[1]
            ],

        ];

        foreach ($categoryNames as $categoryName) {
            $category = new Category();
            $category->setName($categoryName);
            $manager->persist($category);
        }
        foreach ($productsList as $key => $productData) {
            $product = new Products();
            $product->setTitle($productData['title']);
            $product->setDescription($productData['description']);
            $product->setCode($productData['code']);
            $product->setPrice($productData['price']);
            $product->setStock($productData['stock']);
            if ($productData['category']) {
                $product->setCategory($category);
            }
            $product->setStatus($productData['status']);
            $manager->persist($product);
        }

        $customer = new Customer();
        $customer->setFullname("Super Admin");
        $customer->setEmail("admin@admin.com");
        $hashedPassword = password_hash('error404', PASSWORD_DEFAULT);
        $customer->setPassword($hashedPassword);
        $customer->setStatus(false);
        $customer->setRol(2);
        $manager->persist($customer);

        $customer = new Customer();
        $customer->setFullname("Juan Pérez");
        $customer->setEmail("Perez@gmail.com");
         $hashedPassword = password_hash('error404', PASSWORD_DEFAULT);
        $customer->setPassword($hashedPassword);
        $customer->setStatus(true);
        $customer->setRol(1);

        $manager->persist($customer);

        $customer = new Customer();
        $customer->setFullname("María García");
        $customer->setEmail("MaríaGarcía@gmail.com");
         $hashedPassword = password_hash('error404', PASSWORD_DEFAULT);
        $customer->setPassword($hashedPassword);
        $customer->setStatus(true);
        $customer->setRol(1);
        $manager->persist($customer);
        
        $customer = new Customer();
        $customer->setFullname("Laura Sánchez");
        $customer->setEmail("LauraSánchez@gmail.com");
         $hashedPassword = password_hash('error404', PASSWORD_DEFAULT);
        $customer->setPassword($hashedPassword);
        $customer->setStatus(true);
        $customer->setRol(1);
        $manager->persist($customer);

        $manager->flush();

        $customer = new Customer();
        $customer->setFullname("David Flores");
        $customer->setEmail("DavidFlores@gmail.com");
         $hashedPassword = password_hash('error404', PASSWORD_DEFAULT);
        $customer->setPassword($hashedPassword);
        $customer->setStatus(true);
        $customer->setRol(1);
        $manager->persist($customer);

        $manager->flush();

        $customer = new Customer();
        $customer->setFullname("Andrea Torres");
        $customer->setEmail("AndreaTorres@gmail.com");
         $hashedPassword = password_hash('error404', PASSWORD_DEFAULT);
        $customer->setPassword($hashedPassword);
        $customer->setStatus(true);
        $customer->setRol(1);
        $manager->persist($customer);

        $manager->flush();
    }
}
