import EventDispatcher from "../../../@shared/event/event-dispatcher";
import CustomerCreatedEvent from "../customer-created.event";
import SendConsoleLog2WhenCustomertIsCreatedHandler from "./send-console-log-2-when-customer-is-created.handler";

describe("SendConsoleLog2WhenCustomertIsCreatedHandler unit tests", () => {
  it("should register a send console log 2 handler", () => {
      const eventDispatcher = new EventDispatcher();
      const eventHandler = new SendConsoleLog2WhenCustomertIsCreatedHandler();
  
      eventDispatcher.register("CustomerCreatedEvent", eventHandler);
  
      expect(
        eventDispatcher.getEventHandlers["CustomerCreatedEvent"]
      ).toBeDefined();
      expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(
        1
      );
      expect(
        eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
      ).toMatchObject(eventHandler);
    });
    

    it("should notify a send console log 2 event handlers", () => {
      const eventDispatcher = new EventDispatcher();
      const eventHandler = new SendConsoleLog2WhenCustomertIsCreatedHandler();
      const spyEventHandler = jest.spyOn(eventHandler, "handle");
  
      eventDispatcher.register("CustomerCreatedEvent", eventHandler);
  
      expect(
        eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
      ).toMatchObject(eventHandler);
      
      const customerCreatedEvent = new CustomerCreatedEvent({
        id: 1
      });
      eventDispatcher.notify(customerCreatedEvent);
      expect(spyEventHandler).toHaveBeenCalled();
    });
    
});