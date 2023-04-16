<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Entity\Category;

class CategoriesController extends AbstractController
{
    #[Route('/create/category', name: 'app_create_category', methods: ['POST'])]
    public function createCategory(Request $request, ManagerRegistry $doctrine): JsonResponse
    {
        $data = json_decode($request->getContent());
        $entityManager = $doctrine->getManager();
    
        // Check if category name already exists
        $existingCategory = $entityManager->getRepository(Category::class)->findOneBy(['name' => $data->name]);
        if ($existingCategory) {
            return $this->json([
                'error' => sprintf('category with name "%s" already exists ', $data->name),
            ], Response::HTTP_BAD_REQUEST);
        }
    
        $category = new Category();
        $category->setName($data->name);
        $entityManager->persist($category);
        $entityManager->flush();
    
        return $this->json([
            'message' => 'The Category was successfully created',
            'name'=> $data->name
        ], Response::HTTP_CREATED);
    }
}
