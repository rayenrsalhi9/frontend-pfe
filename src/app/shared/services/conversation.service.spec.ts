import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { ConversationService } from "./conversation.service";
import { CommonHttpErrorService } from "@app/core/error-handler/common-http-error.service";
import { PusherService } from "./pusher.service";

describe("ConversationService", () => {
  let service: ConversationService;
  let httpMock: HttpTestingController;
  let mockPusherService: any;

  beforeEach(() => {
    mockPusherService = {
      getSocketId: jasmine.createSpy("getSocketId").and.returnValue("socket-123"),
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ConversationService,
        CommonHttpErrorService,
        { provide: PusherService, useValue: mockPusherService },
      ],
    });

    service = TestBed.inject(ConversationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("createConversation sends POST to conversations/create", () => {
    const payload = { users: ["u1", "u2"], title: "Group", new: true };
    service.createConversation(payload).subscribe();

    const req = httpMock.expectOne("conversations/create");
    expect(req.request.method).toBe("POST");
    expect(req.request.body).toEqual(payload);
    req.flush({ id: "newConv" });
  });

  it("findOrCreateDirectConversation sends POST to conversations/find-or-create", () => {
    service.findOrCreateDirectConversation("u123").subscribe();

    const req = httpMock.expectOne("conversations/find-or-create");
    expect(req.request.method).toBe("POST");
    expect(req.request.body).toEqual({ userId: "u123" });
    req.flush({ id: "conv1" });
  });

  it("getConversations sends GET with page and per_page params", () => {
    service.getConversations(2, 10).subscribe();
    
    const req = httpMock.expectOne((r) => r.url === "conversations");
    expect(req.request.method).toBe("GET");
    expect(req.request.params.get("page")).toBe("2");
    expect(req.request.params.get("per_page")).toBe("10");
    req.flush({ data: [], meta: {} });
  });

  it("deleteConversation sends DELETE to conversations/delete/{id}", () => {
    service.deleteConversation("conv1").subscribe();

    const req = httpMock.expectOne("conversations/delete/conv1");
    expect(req.request.method).toBe("DELETE");
    req.flush(null);
  });

  it("updateConversation sends PUT to conversations/update/{id}", () => {
    const data = { title: "Updated" };
    service.updateConversation("conv1", data).subscribe();

    const req = httpMock.expectOne("conversations/update/conv1");
    expect(req.request.method).toBe("PUT");
    expect(req.request.body).toEqual(data);
    req.flush({ id: "conv1" });
  });

  it("getMessages sends GET to conversations/{id}/messages", () => {
    service.getMessages("conv1").subscribe();

    const req = httpMock.expectOne("conversations/conv1/messages");
    expect(req.request.method).toBe("GET");
    req.flush({ id: "conv1", messages: [] });
  });

  it("setMessage sends POST with X-Socket-Id header", () => {
    const data = { conversationId: "conv1", content: "Hello" };
    service.setMessage(data).subscribe();

    const req = httpMock.expectOne("conversations/message");
    expect(req.request.method).toBe("POST");
    expect(req.request.body).toEqual(data);
    expect(req.request.headers.get("X-Socket-Id")).toBe("socket-123");
    req.flush({ id: "m1" });
  });

  it("conversationAddUser sends POST to conversations/add-user", () => {
    const data = { conversationId: "conv1", selectedUser: { id: "u1" } };
    service.conversationAddUser(data).subscribe();

    const req = httpMock.expectOne("conversations/add-user");
    expect(req.request.method).toBe("POST");
    expect(req.request.body).toEqual(data);
    req.flush([]);
  });

  it("conversationRemoveUser sends POST to conversations/remove-user", () => {
    const data = { conversationId: "conv1", userId: "u1" };
    service.conversationRemoveUser(data).subscribe();

    const req = httpMock.expectOne("conversations/remove-user");
    expect(req.request.method).toBe("POST");
    expect(req.request.body).toEqual(data);
    req.flush([]);
  });

  it("deliveredMessage sends PUT with X-Socket-Id header", () => {
    const data = { id: "m1" };
    service.deliveredMessage(data).subscribe();

    const req = httpMock.expectOne("conversations/message/m1/delivered");
    expect(req.request.method).toBe("PUT");
    expect(req.request.body).toEqual(data);
    expect(req.request.headers.get("X-Socket-Id")).toBe("socket-123");
    req.flush({ id: "m1" });
  });

  it("seenMessage sends PUT with X-Socket-Id header", () => {
    const data = { id: "m1" };
    service.seenMessage(data).subscribe();

    const req = httpMock.expectOne("conversations/message/m1/seen");
    expect(req.request.method).toBe("PUT");
    expect(req.request.body).toEqual(data);
    expect(req.request.headers.get("X-Socket-Id")).toBe("socket-123");
    req.flush({ id: "m1" });
  });

  it("reactionMessage sends PUT with X-Socket-Id header", () => {
    const data = { mid: "m1", type: "like", uid: "user1" };
    service.reactionMessage(data).subscribe();

    const req = httpMock.expectOne("conversations/message/m1/reaction");
    expect(req.request.method).toBe("PUT");
    expect(req.request.body).toEqual(data);
    expect(req.request.headers.get("X-Socket-Id")).toBe("socket-123");
    req.flush({ id: "m1" });
  });
});
