# Priority Queue Examples

The Priority Queue is a versatile data structure that maintains elements in order based on their priorities. Here are practical examples of its applications:

## 1. Task Scheduler

Manage tasks with different priority levels:

```typescript
interface Task {
    id: string;
    name: string;
    priority: number;
    deadline: Date;
}

class TaskScheduler {
    private tasks: PriorityQueue<string, Task>;

    constructor() {
        this.tasks = new PriorityQueue<string, Task>((a, b) => {
            // First compare by priority
            if (a.priority !== b.priority) {
                return b.priority - a.priority;
            }
            // Then by deadline
            return a.deadline.getTime() - b.deadline.getTime();
        });
    }

    public addTask(task: Task): void {
        this.tasks.enqueue(task.id, task);
    }

    public getNextTask(): Task {
        const taskId = this.tasks.dequeue();
        return this.tasks.getPriority(taskId);
    }

    public updateTaskPriority(taskId: string, newPriority: number): void {
        const task = this.tasks.getPriority(taskId);
        task.priority = newPriority;
        this.tasks.updatePriority(taskId, task);
    }
}

// Usage:
const scheduler = new TaskScheduler();
scheduler.addTask({
    id: '1',
    name: 'Urgent Bug Fix',
    priority: 1,
    deadline: new Date('2024-01-01')
});
```

## 2. Network Packet Router

Route network packets based on priority:

```typescript
interface Packet {
    id: string;
    data: Buffer;
    priority: number;
    timestamp: number;
}

class PacketRouter {
    private packets: PriorityQueue<string>;

    constructor() {
        this.packets = new PriorityQueue<string>();
    }

    public queuePacket(packet: Packet): void {
        this.packets.enqueue(packet.id, packet.priority);
    }

    public processNextPacket(): string {
        return this.packets.dequeue();
    }

    public upgradePriority(packetId: string): void {
        const currentPriority = this.packets.getPriority(packetId);
        this.packets.updatePriority(packetId, currentPriority + 1);
    }
}
```

## 3. Game AI Decision Making

Manage AI decisions based on utility scores:

```typescript
interface AIAction {
    name: string;
    utility: number;
    target: string;
}

class AIDecisionMaker {
    private actions: PriorityQueue<string, AIAction>;

    constructor() {
        this.actions = new PriorityQueue<string, AIAction>((a, b) => 
            b.utility - a.utility
        );
    }

    public addAction(action: AIAction): void {
        this.actions.enqueue(action.name, action);
    }

    public getBestAction(): AIAction {
        const actionName = this.actions.dequeue();
        return this.actions.getPriority(actionName);
    }

    public updateUtility(actionName: string, newUtility: number): void {
        const action = this.actions.getPriority(actionName);
        action.utility = newUtility;
        this.actions.updatePriority(actionName, action);
    }
}
```

## 4. Event Processing System

Handle events with different priorities:

```typescript
interface Event {
    type: string;
    priority: number;
    data: any;
}

class EventProcessor {
    private events: PriorityQueue<string>;

    constructor() {
        this.events = new PriorityQueue<string>();
    }

    public pushEvent(event: Event): void {
        this.events.enqueue(event.type, event.priority);
    }

    public processNextEvent(): string {
        return this.events.dequeue();
    }

    public escalateEvent(eventType: string): void {
        const currentPriority = this.events.getPriority(eventType);
        this.events.updatePriority(eventType, currentPriority * 2);
    }
}
```

Key Benefits:
1. Efficient Priority Management: O(log n) operations
2. Dynamic Priority Updates: Can change priorities at runtime
3. Flexible Comparisons: Custom comparison functions
4. Type Safety: Generic type parameters
5. Memory Efficient: Compact heap representation

Common Use Cases:
- Task Scheduling
- Process Management
- Network Packet Routing
- Game AI Decision Making
- Event Processing
- Resource Allocation
- Job Queue Management
- Real-time Systems 