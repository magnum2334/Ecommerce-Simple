<?php

namespace App\Repository;

use App\Entity\Customer;
use App\Entity\Order;
use App\Entity\OrderDetail;
use App\Entity\Products;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Order>
 *
 * @method Order|null find($id, $lockMode = null, $lockVersion = null)
 * @method Order|null findOneBy(array $criteria, array $orderBy = null)
 * @method Order[]    findAll()
 * @method Order[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class OrderRepository extends ServiceEntityRepository
{
    private $conn;
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Order::class);
        $this->conn = $registry->getConnection();
    }

    public function getOrderDetails(): ?array
    {
        $qb = $this->createQueryBuilder('o')
            ->select('od.unitPrice, od.quantity, o.id AS orden_id, cu.fullname, cu.email , po.code , po.id AS product_id, o.order_date')
            ->join(OrderDetail::class, 'od', 'WITH', 'od.orden = o.id')
            ->join(Customer::class, 'cu', 'WITH', 'cu.id = od.customer')
            ->join(Products::class, 'po', 'WITH', 'po.id = od.product')
            ->getQuery()->getArrayResult();
        return $qb;
    }
}
