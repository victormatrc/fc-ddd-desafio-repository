import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {
    const t = await OrderModel.sequelize.transaction();

    try {
      await OrderModel.update(
        {
          id: entity.id,
          customer_id: entity.customerId,
          total: entity.total()
        },
        {
          where: {
            id: entity.id,           
          },
          transaction: t,
        }    
      );
      const currentItemsInDb = await OrderItemModel.findAll({
        where: { order_id: entity.id },
        attributes: ['id'], // Só precisamos dos IDs
        transaction: t, // Garante a leitura dentro da transação
      });
      const currentItemIdsInDb = currentItemsInDb.map(item => item.id);

      // 3. Pega os IDs dos itens que vieram na entidade (a lista 'nova')
      // Filtramos os 'null' ou 'undefined' que podem ser itens novos
      const entityItemIds = entity.items
        .map(item => item.id)
        .filter(id => id != null);

      // 4. Calcula quais IDs devem ser DELETADOS
      // (IDs que estão no banco, mas NÃO estão mais na lista da entidade)
      const idsToDelete = currentItemIdsInDb.filter(
        id => !entityItemIds.includes(id)
      );

      // 5. Executa a deleção (se houver itens para deletar)
      if (idsToDelete.length > 0) {
        await OrderItemModel.destroy({
          where: {
            id: idsToDelete,
            order_id: entity.id // Dupla checagem de segurança
          },
          transaction: t,
        });
      }
      for (const item of entity.items) {
        await OrderItemModel.upsert(
          {
            id: item.id,
            name: item.name,
            price: item.price,
            product_id: item.productId,
            quantity: item.quantity,
            order_id: entity.id
          },
          {
            transaction: t, // <-- Passe a transação
          }
        );
      }
      await t.commit();
    } catch (error) {
      await t.rollback();
      console.error("Falha ao atualizar ordem e itens:", error);
      throw new Error("Não foi possível atualizar a ordem.");
    }
    
  }
    
  async find(id: string): Promise<Order> {
    let orderModel;
    try {
      orderModel = await OrderModel.findOne({
        where: {
          id,
        },
        rejectOnEmpty: true,
        include: ["items"],
      });
    } catch (error) {
      throw new Error("Order not found");
    }
    let itens :OrderItem[] = [];
    orderModel.items.map((i) => {
      itens.push(new OrderItem(i.id,i.name,i.price,i.product_id,i.quantity))
    });
    const order = new Order(orderModel.id,orderModel.customer_id,itens);  
    return order;
  }
  async findAll(): Promise<Order[]> {
    const orderModels = await OrderModel.findAll({include: [OrderItemModel],});

    const orders = orderModels.map((orderModel) => {
      let itens :OrderItem[] = [];
      orderModel.items.map((i) => {
        itens.push(new OrderItem(i.id,i.name,i.price,i.product_id,i.quantity))
      });
      const order = new Order(orderModel.id,orderModel.customer_id,itens);  
      return order;
    });
    return orders;
  }
}
