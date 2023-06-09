<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Entity\Order;
use App\Entity\OrderDetail;
use App\Entity\Customer;
use App\Entity\Products;


class OrdersController extends AbstractController
{
   
    #[Route('/create/order', name: 'app_create_order', methods: ['POST'])]
    public function createOrder(Request $request, ManagerRegistry $doctrine): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $customer = $doctrine->getRepository(Customer::class)->find($data['customer_id']);
        $order = new Order();
        $order->setCustomer($customer);
        $order->setTotalPrice($data['total_price']);
        $order->setOrderDate(\DateTime::createFromFormat('Y-m-d', $data['order_date']));


        $entityManager = $doctrine->getManager();
        $entityManager->persist($order);
        $entityManager->flush();


        $orderDetails = $data['order_details'];

        foreach ($orderDetails as $orderDetail) {
            $product = $doctrine->getRepository(Products::class)->find($orderDetail['product_id']);

            if (!$product) {
                return new JsonResponse([
                    'message' => 'el product with ID ' . $orderDetail['product_id'] . ' does not exist',
                ], Response::HTTP_BAD_REQUEST);
            }
            // Decrement the stock
            if ($product->getStock() <= 0) {
                $product->setStock(0);
                $product->setStatus(false);
                $entityManager->flush();
                return new JsonResponse([
                    'message' => 'el producto' . $product->getTitle() . ' no tiene stock en el inventario',
                ], Response::HTTP_BAD_REQUEST);
            }
            if ($product->getStock() ==  $orderDetail['quantity']) {
                $product->setStock(0);
                $product->setStatus(false);
                $entityManager->persist($product);
                $orderDetailEntity = new OrderDetail();
                $orderDetailEntity->setOrderDate(\DateTime::createFromFormat('Y-m-d', $data['order_date']));
                $orderDetailEntity->setCustomer($customer);
                $orderDetailEntity->setOrden($order);
                $orderDetailEntity->setQuantity($orderDetail['quantity']);
                $orderDetailEntity->setProduct($product);
                $orderDetailEntity->setUnitPrice($product->getPrice() * $orderDetail['quantity']);
                $entityManager->persist($orderDetailEntity);
                $entityManager->flush();
                return new JsonResponse([
                    'message' => 'The order was successfully created',
                ], Response::HTTP_CREATED);
            }
            $quantity = $orderDetail['quantity'];
            
            $product->setStock($product->getStock() - $quantity);
           
           
            if ($product->getStock() <  $quantity) {
                return new JsonResponse([
                    'message' => 'el producto' . $product->getTitle() . ' no tiene suficientes stocks en el inventario para la compra',
                ], Response::HTTP_BAD_REQUEST);
            }
           
           
            $entityManager->persist($product);

            $orderDetailEntity = new OrderDetail();
            $orderDetailEntity->setOrderDate(\DateTime::createFromFormat('Y-m-d', $data['order_date']));
            $orderDetailEntity->setCustomer($customer);
            $orderDetailEntity->setOrden($order);
            $orderDetailEntity->setQuantity($orderDetail['quantity']);
            $orderDetailEntity->setProduct($product);
            $orderDetailEntity->setUnitPrice($product->getPrice() * $orderDetail['quantity']);
            $entityManager->persist($orderDetailEntity);
        }

        $entityManager->flush();

        return new JsonResponse([
            'message' => 'La orden ha sido creada exitosamente',
        ], Response::HTTP_CREATED);
    }
}
