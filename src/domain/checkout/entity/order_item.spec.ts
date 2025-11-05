import Order from "./order";
import OrderItem from "./order_item";

describe("OrderItem unit tests", () => {
  it("should change price", () => {
    const orderItem = new OrderItem("1", "Nome", 100.10,"123", 5);
    orderItem.changePrice(200.95);
    expect(orderItem.price).toBe(200.95);
  });

  it("should throw error when price is invalid", () => {
    const orderItem = new OrderItem("1", "Nome", 100.10,"123", 5);
    expect(() => {
      orderItem.changePrice(-1)
    }).toThrowError("Price must be 0 or greater");
  });

});
