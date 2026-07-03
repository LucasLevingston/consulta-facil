import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SuspenseBoundary } from "@/components/custom/suspense-boundary/suspense-boundary";

function createDeferred<T>() {
	let resolve!: (value: T) => void;
	const promise = new Promise<T>((res) => {
		resolve = res;
	});
	return { promise, resolve };
}

function createResource<T>(promise: Promise<T>) {
	let status: "pending" | "success" = "pending";
	let result: T;
	const suspender = promise.then((value) => {
		status = "success";
		result = value;
	});
	return {
		read(): T {
			if (status === "pending") throw suspender;
			return result;
		},
	};
}

describe("SuspenseBoundary", () => {
	it("shows the loading fallback while a child suspends, then renders it", async () => {
		const deferred = createDeferred<string>();
		const resource = createResource(deferred.promise);

		function Reader() {
			return <div>{resource.read()}</div>;
		}

		render(
			<SuspenseBoundary>
				<Reader />
			</SuspenseBoundary>,
		);

		expect(screen.getByText("Consulta Fácil")).toBeInTheDocument();

		deferred.resolve("loaded content");

		await waitFor(() =>
			expect(screen.getByText("loaded content")).toBeInTheDocument(),
		);
	});

	it("shows the error fallback when a child throws, and recovers on retry", async () => {
		const spy = vi.spyOn(console, "error").mockImplementation(() => {});
		let shouldThrow = true;

		function Reader() {
			if (shouldThrow) throw new Error("boom");
			return <div>recovered</div>;
		}

		render(
			<SuspenseBoundary>
				<Reader />
			</SuspenseBoundary>,
		);

		expect(screen.getByText("Erro ao carregar dados")).toBeInTheDocument();

		shouldThrow = false;
		screen.getByRole("button", { name: "Tentar novamente" }).click();

		await waitFor(() =>
			expect(screen.getByText("recovered")).toBeInTheDocument(),
		);

		spy.mockRestore();
	});
});
