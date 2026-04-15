package com.aluguel.controller;

import com.aluguel.model.Automovel;
import com.aluguel.model.Cliente;
import com.aluguel.model.Pedido;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.validation.Validator;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Path("/api/pedidos")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PedidoResource {

    @Inject
    Validator validator;

    @GET
    public List<Pedido> listar() {
        return Pedido.listarTodos();
    }

    @GET
    @Path("/{id}")
    public Response buscarPorId(@PathParam("id") Long id) {
        Pedido pedido = Pedido.buscarPorId(id);
        if (pedido == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(pedido).build();
    }

    @POST
    @Transactional
    public Response criar(Map<String, Object> dados) {
        Long clienteId = Long.valueOf(dados.get("clienteId").toString());
        Long automovelId = Long.valueOf(dados.get("automovelId").toString());
        String dataInicioStr = dados.get("dataInicio").toString();
        String dataFimStr = dados.get("dataFim").toString();

        Cliente cliente = Cliente.buscarPorId(clienteId);
        Automovel automovel = Automovel.buscarPorId(automovelId);

        if (cliente == null || automovel == null) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Cliente ou automóvel não encontrado").build();
        }

        Pedido pedido = new Pedido();
        pedido.cliente = cliente;
        pedido.automovel = automovel;
        pedido.dataInicio = LocalDate.parse(dataInicioStr);
        pedido.dataFim = LocalDate.parse(dataFimStr);
        pedido.status = "pendente";

        automovel.status = "alugado";
        pedido.persist();

        return Response.status(Response.Status.CREATED).entity(pedido).build();
    }

    @PUT
    @Path("/{id}/status")
    @Transactional
    public Response atualizarStatus(@PathParam("id") Long id, Map<String, String> dados) {
        Pedido pedido = Pedido.buscarPorId(id);
        if (pedido == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        String novoStatus = dados.get("status");
        pedido.status = novoStatus;

        if ("concluido".equals(novoStatus) || "cancelado".equals(novoStatus)) {
            pedido.automovel.status = "disponivel";
        }

        return Response.ok(pedido).build();
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public Response deletar(@PathParam("id") Long id) {
        Pedido pedido = Pedido.buscarPorId(id);
        if (pedido == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        if ("pendente".equals(pedido.status) || "ativo".equals(pedido.status)) {
            pedido.automovel.status = "disponivel";
        }
        pedido.delete();
        return Response.status(Response.Status.NO_CONTENT).build();
    }
}
