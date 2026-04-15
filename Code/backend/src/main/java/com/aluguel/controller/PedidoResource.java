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
    public List<Pedido> listar(@QueryParam("clienteId") Long clienteId) {
        if (clienteId != null) {
            return Pedido.listarPorCliente(clienteId);
        }
        return Pedido.listAll();
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

        LocalDate dataInicio = LocalDate.parse(dataInicioStr);
        LocalDate dataFim = LocalDate.parse(dataFimStr);
        
        if (dataFim.isBefore(dataInicio)) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("A data de fim não pode ser anterior à data de início").build();
        }
        
        if (dataInicio.isBefore(LocalDate.now())) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("A data de início não pode ser no passado").build();
        }
        
        if (!"disponivel".equals(automovel.status)) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Automóvel não está disponível para aluguel").build();
        }
        
        Pedido pedido = new Pedido();
        pedido.cliente = cliente;
        pedido.automovel = automovel;
        pedido.dataInicio = dataInicio;
        pedido.dataFim = dataFim;
        pedido.status = "pendente";

        Object objValue = dados.get("objetivo");
        pedido.objetivo = (objValue != null && !objValue.toString().isBlank()) ? objValue.toString() : null;

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

        if ("finalizado".equals(novoStatus) || "recusado".equals(novoStatus) || "cancelado".equals(novoStatus)) {
            pedido.automovel.status = "disponivel";
        } else if ("aprovado".equals(novoStatus)) {
            pedido.automovel.status = "alugado";
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
        if ("pendente".equals(pedido.status) || "aprovado".equals(pedido.status)) {
            pedido.automovel.status = "disponivel";
        }
        pedido.delete();
        return Response.status(Response.Status.NO_CONTENT).build();
    }
}
