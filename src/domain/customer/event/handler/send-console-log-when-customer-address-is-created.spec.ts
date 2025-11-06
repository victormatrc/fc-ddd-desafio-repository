import EventDispatcher from "../../../@shared/event/event-dispatcher";
import CustomerAddressChangedEvent from "../customer-address-changed.event";
import CustomerCreatedEvent from "../customer-created.event";
import SendConsoleLogWhenCustomertAddressIsChangedHandler from "./send-console-log-when-customer-address-is-changed.handler";

describe("SendConsoleLogWhenCustomertAddressIsChanged unit tests", () => {
  it("should register a send console log handler", () => {
      const eventDispatcher = new EventDispatcher();
      const eventHandler = new SendConsoleLogWhenCustomertAddressIsChangedHandler();
  
      eventDispatcher.register("CustomerAddressChangedEvent", eventHandler);
  
      expect(
        eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"]
      ).toBeDefined();
      expect(eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"].length).toBe(
        1
      );
      expect(
        eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"][0]
      ).toMatchObject(eventHandler);
    });
    

    it("should notify a send console log 2 event handlers", () => {
      const eventDispatcher = new EventDispatcher();
      const eventHandler = new SendConsoleLogWhenCustomertAddressIsChangedHandler();
      const spyEventHandler = jest.spyOn(eventHandler, "handle");
  
      eventDispatcher.register("CustomerAddressChangedEvent", eventHandler);
  
      expect(
        eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"][0]
      ).toMatchObject(eventHandler);
      
      const customerAddressChangedEvent = new CustomerAddressChangedEvent({
        id: 1,
        nome: "Victor",
        endereco: "Rua ABCD, n10"
      });
      eventDispatcher.notify(customerAddressChangedEvent);
      expect(spyEventHandler).toHaveBeenCalled();
    });
    
});