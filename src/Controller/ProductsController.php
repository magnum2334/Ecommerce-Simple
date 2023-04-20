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

        // Validate required fields
        $requiredFields = ['title', 'description', 'code', 'price', 'stock', 'status'];
        foreach ($requiredFields as $field) {
            if (!$request->request->has($field)) {
                return $this->json([
                    'error' => sprintf('"%s" es necesario', $field),
                ], Response::HTTP_BAD_REQUEST);
            }
        }

        $entityManager = $doctrine->getManager();
        // Check if product with title already exists
        $existingProduct = $entityManager->getRepository(Products::class)->findOneBy(['title' => $request->request->get('title')]);
        if ($existingProduct) {
            return $this->json([
                'error' => sprintf('El Producto con el titulo "%s" ya existe, intenta otro.', $request->request->get('title')),
            ], Response::HTTP_BAD_REQUEST);
        }
        // Check if product with descripcion already exists
        $existingProduct = $entityManager->getRepository(Products::class)->findOneBy(['description' => $request->request->get('description')]);
        if ($existingProduct) {
            return $this->json([
                'error' => sprintf('El Producto con la descriocion "%s" ya existe, intenta otro.', $request->request->get('description')),
            ], Response::HTTP_BAD_REQUEST);
        }
        // Check if product with description already exists
        $existingProduct = $entityManager->getRepository(Products::class)->findOneBy(['code' => $request->request->get('code')]);
        if ($existingProduct) {
            return $this->json([
                'error' => sprintf('El Producto con el codigo "%s" ya existe, intenta otro.', $request->request->get('code')),
            ], Response::HTTP_BAD_REQUEST);
        }

        // Validate price and stock
        if (!is_numeric($request->request->get('price')) ||$request->request->get('price') < 0) {
            return $this->json([
                'error' => 'Valor invalido para precio del producto',
            ], Response::HTTP_BAD_REQUEST);
        }
        if (!is_numeric($request->request->get('stock')) ||  $request->request->get('stock') < 0) {
            return $this->json([
                'error' => 'valor invalido para la cantidad del producto',
            ], Response::HTTP_BAD_REQUEST);
        }

        // Check if category exists
        if ($request->request->get('category_id')) {
            $category = $entityManager->getRepository(Category::class)->find($request->request->get('category_id'));
            if (!$category) {
                return $this->json([
                    'error' => 'Categoria "%s" no existe',
                ], Response::HTTP_BAD_REQUEST);
            }
        }

        $product = new Products();
        $product->setTitle($request->request->get('title'));
        $product->setDescription($request->request->get('description'));
        $product->setCode($request->request->get('code'));
        $product->setPrice($request->request->get('price'));
        $product->setStock($request->request->get('stock'));
        $product->setStatus($request->request->get('status'));
        if (isset($category)) {
            $product->setCategory($category);
        }
        $entityManager->persist($product);
        $entityManager->flush();
        return $this->json([
            'message' => 'El producto se creo!! ',
            'code' =>  $product->getCode()
        ], Response::HTTP_CREATED);
        
    }
    #[Route('update/product', name: 'product_update',  methods: ['POST'])]
    public function update(Request $request, ManagerRegistry $doctrine): Response
    {
        $entityManager = $doctrine->getManager();
        $productsRepository = $entityManager->getRepository(Products::class);
        $data = json_decode($request->getContent(), true);
        // Buscar el producto por el código
        $product = $productsRepository->findOneBy(['id' => $data['id']]);


        if (isset($data['category'])) {
            $category = $entityManager->getRepository(Category::class)->find($data['category']['id']);
            if (!$category) {
                return $this->json([
                    'error' => 'Categoria "%s" no existe',
                ], Response::HTTP_BAD_REQUEST);
            }
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
        // Actualizar las propiedades del producto con los nuevos valores
        $product->setTitle($data['title']);
        $product->setDescription($data['description']);
        $product->setCode($data['code']);
        $product->setPrice($data['price']);
        $product->setStock($data['stock']);
        $product->setStatus($data['status']);
        $product->setCategory($category);
        // Persistir los cambios en la base de datos
        $entityManager->flush();
        // Crear una respuesta JSON con el producto actualizado
        return $this->json([
            'message' => 'El producto se actualizo!! ',
            'code' =>  $product->getCode()
        ], Response::HTTP_CREATED);
    }
}
