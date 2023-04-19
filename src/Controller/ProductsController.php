<?php

namespace App\Controller;


use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Entity\Products;
use App\Entity\Category;

class ProductsController extends AbstractController
{
    #[Route('/create/product', name: 'app_create_product', methods: ['POST'])]
    public function createProduct(Request $request, ManagerRegistry $doctrine): JsonResponse
    {
        // Parse request data
        $data = json_decode($request->getContent(), true);

        // Validate required fields
        $requiredFields = ['title', 'description', 'code', 'price', 'stock', 'status'];
        foreach ($requiredFields as $field) {
            if (!isset($data[$field])) {
                return $this->json([
                    'error' => sprintf('"%s" es necesario', $field),
                ], Response::HTTP_BAD_REQUEST);
            }
        }

        $entityManager = $doctrine->getManager();
        // Check if product with title already exists
        $existingProduct = $entityManager->getRepository(Products::class)->findOneBy(['title' => $data['title']]);
        if ($existingProduct) {
            return $this->json([
                'error' => sprintf('El Producto con el titulo "%s" ya existe, intenta otro.', $data['title']),
            ], Response::HTTP_BAD_REQUEST);
        }
        // Check if product with descripcion already exists
        $existingProduct = $entityManager->getRepository(Products::class)->findOneBy(['description' => $data['description']]);
        if ($existingProduct) {
            return $this->json([
                'error' => sprintf('El Producto con la descriocion "%s" ya existe, intenta otro.', $data['description']),
            ], Response::HTTP_BAD_REQUEST);
        }
        // Check if product with description already exists
        $existingProduct = $entityManager->getRepository(Products::class)->findOneBy(['code' => $data['code']]);
        if ($existingProduct) {
            return $this->json([
                'error' => sprintf('El Producto con el codigo "%s" ya existe, intenta otro.', $data['code']),
            ], Response::HTTP_BAD_REQUEST);
        }

        // Check if product with code already exists
        $existingProduct = $entityManager->getRepository(Products::class)->findOneBy(['code' => $data['code']]);
        if ($existingProduct) {
            return $this->json([
                'error' => sprintf('El Producto con el codigo "%s" ya existe, intenta otro.', $data['code']),
            ], Response::HTTP_BAD_REQUEST);
        }

        // Validate price and stock
        if (!is_numeric($data['price']) || $data['price'] < 0) {
            return $this->json([
                'error' => 'Valor invalido para precio del producto',
            ], Response::HTTP_BAD_REQUEST);
        }
        if (!is_numeric($data['stock']) || $data['stock'] < 0) {
            return $this->json([
                'error' => 'valor invalido para la cantidad del producto',
            ], Response::HTTP_BAD_REQUEST);
        }

        // Check if category exists
        if (isset($data['category_id'])) {
            $category = $entityManager->getRepository(Category::class)->find($data['category_id']);
            if (!$category) {
                return $this->json([
                    'error' => 'Categoria "%s" no existe',
                ], Response::HTTP_BAD_REQUEST);
            }
        }

        $product = new Products();
        $product->setTitle($data['title']);
        $product->setDescription($data['description']);
        $product->setCode($data['code']);
        $product->setPrice($data['price']);
        $product->setStock($data['stock']);
        $product->setStatus($data['status']);
        if (isset($category)) {
            $product->setCategory($category);
        }

        $entityManager->persist($product);
        $entityManager->flush();

        return $this->json([
            'message' => 'El producto se creo!! ',
            'code' => $data['code']
        ], Response::HTTP_CREATED);
    }
}
