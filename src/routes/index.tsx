import {
	Badge,
	Box,
	Card,
	Checkbox,
	Container,
	Flex,
	Heading,
	IconButton,
	ScrollArea,
	Separator,
	Text,
	TextField,
} from "@radix-ui/themes";
import { useLiveQuery } from "@tanstack/react-db";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { todosCollection } from "@/db/collections/todos";

export const Route = createFileRoute("/")({
	ssr: false,
	loader: async () => {
		await todosCollection.preload();
		return null;
	},
	component: TodoApp,
});

function TodoApp() {
	const [newText, setNewText] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);

	const { data: todos } = useLiveQuery((q) =>
		q
			.from({ todo: todosCollection })
			.orderBy(({ todo }) => todo.created_at, "asc"),
	);

	const completedCount = todos?.filter((t) => t.completed).length ?? 0;
	const totalCount = todos?.length ?? 0;

	async function addTodo() {
		const text = newText.trim();
		if (!text) return;
		setNewText("");
		await todosCollection.insert({
			id: crypto.randomUUID(),
			text,
			completed: false,
			created_at: new Date(),
			updated_at: new Date(),
		});
		inputRef.current?.focus();
	}

	async function toggleTodo(id: string, completed: boolean) {
		await todosCollection.update(id, (draft) => {
			draft.completed = !completed;
			draft.updated_at = new Date();
		});
	}

	async function deleteTodo(id: string) {
		await todosCollection.delete(id);
	}

	return (
		<Container size="2" py="8">
			<Flex direction="column" gap="6">
				<Flex direction="column" gap="1">
					<Heading size="7" weight="bold">
						Todos
					</Heading>
					<Text color="gray" size="2">
						{completedCount} of {totalCount} completed
					</Text>
				</Flex>

				<Card variant="surface">
					<Flex gap="2" p="2">
						<TextField.Root
							ref={inputRef}
							placeholder="Add a new todo..."
							value={newText}
							onChange={(e) => setNewText(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") addTodo();
							}}
							style={{ flex: 1 }}
							size="2"
						/>
						<IconButton
							onClick={addTodo}
							disabled={!newText.trim()}
							size="2"
							variant="solid"
						>
							<Plus size={16} />
						</IconButton>
					</Flex>
				</Card>

				{todos && todos.length > 0 ? (
					<Card variant="surface">
						<ScrollArea style={{ maxHeight: "500px" }}>
							<Flex direction="column">
								{todos.map((todo, index) => (
									<Box key={todo.id}>
										{index > 0 && <Separator size="4" />}
										<Flex
											align="center"
											gap="3"
											px="3"
											py="3"
											style={{
												opacity: todo.completed ? 0.6 : 1,
												transition: "opacity 0.15s",
											}}
										>
											<Checkbox
												checked={todo.completed}
												onCheckedChange={() =>
													toggleTodo(todo.id, todo.completed)
												}
												size="2"
											/>
											<Text
												size="2"
												style={{
													flex: 1,
													textDecoration: todo.completed
														? "line-through"
														: "none",
													wordBreak: "break-word",
												}}
											>
												{todo.text}
											</Text>
											{todo.completed && (
												<Badge color="green" variant="soft" size="1">
													Done
												</Badge>
											)}
											<IconButton
												variant="ghost"
												color="red"
												size="1"
												onClick={() => deleteTodo(todo.id)}
											>
												<Trash2 size={14} />
											</IconButton>
										</Flex>
									</Box>
								))}
							</Flex>
						</ScrollArea>
					</Card>
				) : (
					<Flex direction="column" align="center" gap="2" py="8">
						<Text size="4">No todos yet</Text>
						<Text color="gray" size="2">
							Add one above to get started
						</Text>
					</Flex>
				)}
			</Flex>
		</Container>
	);
}
