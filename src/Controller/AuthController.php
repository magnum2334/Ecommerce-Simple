<?php

namespace App\Controller;


use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use App\Entity\Customer;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class AuthController extends AbstractController
{

    #[Route('/register', name: 'app_register')]
    public function register(): Response
    {
        return $this->render('auth/register.html.twig', [
            'controller_name' => 'AuthController',
        ]);
    }

    #[Route('/login', name: 'app_login')]
    public function login(): Response
    {
        return $this->render('auth/login.html.twig', [
            'controller_name' => 'AuthController',
        ]);
    }

    #[Route('/auth', name: 'app_auth', methods: ['POST'])]
    public function auth(Request $request, ManagerRegistry $doctrine): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
    
        $entityManager = $doctrine->getManager();
        $userRepository = $entityManager->getRepository(Customer::class);
        $user = $userRepository->findOneBy(['email' => $data['email' ]]);
    
        if (!$user || !password_verify($data['password' ], $user->getPassword())) {
            throw new BadRequestHttpException('Invalid email or password');
        }
    
        $token = bin2hex(random_bytes(32));
        $user->setApiToken($token);
        $entityManager->flush();
    
        return $this->json([
            'message' => 'Welcome!',
            'token' => $token
        ]);
    }
    
    
    #[Route('/create/customer', name: 'app_create_customer', methods: ['POST'])]
    public function createCustomer(Request $request, ManagerRegistry $doctrine): Response
    {
        $data = json_decode($request->getContent(), true);
        $customer = new Customer();
        $customer->setFullname($data['fullname']);
        $customer->setEmail($data['email']);
        /* encript password */
        $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);
        $customer->setPassword($hashedPassword);
        $customer->setStatus(true);

        $entityManager = $doctrine->getManager();
        $entityManager->persist($customer);
        $entityManager->flush();

        return new JsonResponse([
            'message' => 'The customer was successfully created',
        ], Response::HTTP_CREATED);
    }
}
