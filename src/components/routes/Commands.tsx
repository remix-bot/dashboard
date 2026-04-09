import { Component, createResource, For } from "solid-js";
import { useAuth } from "../../lib/providers/auth/AuthProvider";
import Command from "./Command";
import "../../styles/commands.css";

const Commands: Component = () => {
  const { api } = useAuth();
  const [commands] = createResource(async () => {
    const res = api.get("/commands");
    return res;
  });

  const searchCommands = (e: KeyboardEvent) => {
    const filter = (e.target as HTMLInputElement).value.toLowerCase();
    const table = document.getElementById('commands')?.getElementsByTagName('tbody')[0];
    if (!table) return;
    for (let i = 0; i < table.rows.length; i++) {
      const row = table.rows[i];
      const name = row.cells[0].textContent.toLowerCase();
      const description = row.cells[1].textContent.toLowerCase();
      if (name.includes(filter) || description.includes(filter)) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    }
  }
  return <>
    <br />
    <h1 style="text-align: center; font-size: 200%">Commands</h1>
    <p style="text-align: center">Note: A better command overview is in the making.</p>
    <section style="padding: 2.5rem;">
      <input placeholder="Search..." id="search" onKeyUp={searchCommands}></input>
      <table style="border-radius: 5px" id="commands">
        <thead>
          <tr style="color: white; font-size: 120%; background-color: rgb(31 41 55);">
            <th>Name</th>
            <th>Description</th>
            <th>Usage</th>
            <th>Aliases</th>
          </tr>
        </thead>
        <tbody>
          <For each={commands()}>
            {
              (command) => {
                return <>
                  {/*<Command aliases={command.aliases} description={command.description} name={command.name} options={command.options} uid={command.uid}></Command>*/}
                  <tr>
                    <td>{command.name}</td>
                    <td>{command.description}</td>
                    <td><code>{command.usage || "tba"}</code></td>
                    <td>{command.aliases.join(", ")}</td>
                  </tr>
                </>
              }
            }
          </For>
        </tbody>
      </table>
    </section>
  </>
}

export default Commands;
