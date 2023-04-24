<?php

namespace App\Controller;


use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use App\Entity\Customer;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use App\Entity\OrderDetail;

class DashboardUserController extends AbstractController
{

    #[Route('/dashboard/user/{id}', name: 'app_dashboard_user')]
    public function index($id, ManagerRegistry $doctrine)
    {
        $entityManager = $doctrine->getManager();
        $userRepository = $entityManager->getRepository(Customer::class);

        $user = $userRepository->find($id);

        if (!$user) {
            throw $this->createNotFoundException('User not found');
        }
        $orderDetailsRepository = $entityManager->getRepository(OrderDetail::class);
        $orderDetails = $orderDetailsRepository->findBy(['customer' => $user->getId()]);
        return $this->render('dashboard_user/index.html.twig', [
            'user' => $user->getEmail(),
            'orderDetails' => $orderDetails
        ]);
    }

    #[Route('/dashboard/user', name: 'app_auth', methods: ['POST'])]
    public function auth(Request $request, ManagerRegistry $doctrine): Response
    {
        $data = json_decode($request->getContent(), true);
        $entityManager = $doctrine->getManager();
        $userRepository = $entityManager->getRepository(Customer::class);
        $user = $userRepository->findOneBy(['email' => $data['email']]);

        if (!$user || !password_verify($data['password'], $user->getPassword())) {
            throw new BadRequestHttpException('Invalid email or password');
        }

        $token = bin2hex(random_bytes(32));
        $user->setApiToken($token);
        $entityManager->flush();

        return $this->json([
            'token' => $token,
            'user' => $user,
        ]);
       
    }
}
