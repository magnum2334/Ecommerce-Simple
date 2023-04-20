<?php

namespace App\Controller;


use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Entity\Products;
use App\Entity\Category;
use App\Entity\Customer;
use App\Repository\OrderRepository;



class DashboardController extends AbstractController
{
    #[Route('/dashboard', name: 'app_dashboard')]
    public function index(): Response
    {
        return $this->render('dashboard/index.html.twig', [
            'controller_name' => 'DashboardController',
        ]);
    }
    #[Route('/categories', name: 'app_categories', methods: ['GET'])]
    public function getCategories(ManagerRegistry $doctrine): JsonResponse
    {
        $entityManager = $doctrine->getManager();
        $categories = $entityManager->getRepository(Category::class)
            ->findBy([], ['id' => 'ASC']);

        return $this->json($categories);
    }
    #[Route('/products', name: 'app_products', methods: ['GET'])]
    public function getProducts(ManagerRegistry $doctrine): JsonResponse
    {
        $entityManager = $doctrine->getManager();
        $repository = $entityManager->getRepository(Products::class, ProductsRepository::class);
        $products = $repository->createQueryBuilder('p')
            ->orderBy('p.status', 'DESC')
            ->getQuery()
            ->getResult();

        return $this->json($products);
    }


    #[Route('/customers', name: 'app_customers', methods: ['GET'])]
    public function getCustomers(ManagerRegistry $doctrine): JsonResponse
    {
        $entityManager = $doctrine->getManager();
        $customers = $entityManager->getRepository(Customer::class)->findAll();

        return $this->json($customers);
    }

    #[Route('/orders', name: 'app_orders', methods: ['GET'])]
    public function getOrders(OrderRepository $orderRepository): JsonResponse
    {
        return $this->json($orderRepository->getOrderDetails());
    }
}
