import React from "react";

export default function page() {
  return (
    <form method="POST" action="/create-customer-portal-session">
      <button type="submit">Manage billing</button>
    </form>
  );
}
