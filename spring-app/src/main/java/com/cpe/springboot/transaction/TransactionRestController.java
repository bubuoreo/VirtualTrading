package com.cpe.springboot.transaction;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.cpe.springboot.common.DTOMapper;
import com.cpe.springboot.user.UserDTO;
import com.cpe.springboot.user.UserModel;
import com.cpe.springboot.user.UserRestController;
import com.cpe.springboot.user.UserService;

//ONLY FOR TEST NEED ALSO TO ALLOW CROOS ORIGIN ON WEB BROWSER SIDE
@CrossOrigin
@RestController
public class TransactionRestController {

	private final TransactionService transactionService;

	public TransactionRestController(TransactionService transactionService) {
		this.transactionService = transactionService;
	}

	@RequestMapping(method = RequestMethod.GET, value = "/transactions")
	private List<TransactionDTO> getAllTransactions() {
		List<TransactionDTO> tDTOList = new ArrayList<TransactionDTO>();
		for (TransactionModel transactionModel : transactionService.getAllTransactions()) {
			tDTOList.add(DTOMapper.fromTransactionModelToTransactionDTO(transactionModel));
		}
		return tDTOList;
	}

	@RequestMapping(method = RequestMethod.POST, value = "/transaction")
	public TransactionDTO writeTransaction(@RequestBody TransactionDTO t) {

		Optional<UserModel> user = transactionService.checkUserExistance(t.getUserId());

		if (t.getAssetQuantity() != 0.0 && t.getAssetPrice() != 0.0) {
			if (user.isPresent()) {
				UserModel userModel = user.get();
				if (t.getType().equals("BUY")) {
					// Transaction is "BUY" Type
					if (userModel.getAccount() >= t.getTransactionPrice()) {
						return transactionService.writeTransaction(t, false);
	
					} else {
						throw new ResponseStatusException(HttpStatus.NOT_FOUND,
								"User id:" + t.getUserId() + ", not enough funds", null);
					}
				} else {
					// Transaction is "SELL" Type
					if (transactionService.checkAssetAvailability(t, userModel)) {
						return transactionService.writeTransaction(t, false);
					} else {
						throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User id:" + t.getUserId() + ", lack of",
								null);
					}
				}
			} else {
				throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User id:" + t.getUserId() + ", not found", null);
			}
		} else {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Null amount transaction not accepted", null);
		}
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/transactions/user/{id}")
	private List<TransactionDTO> getAllTransactions(@PathVariable String id) {
		List<TransactionDTO> tDTOList = new ArrayList<TransactionDTO>();
		for (TransactionModel transactionModel : transactionService.getUserTransactions(Integer.valueOf(id))) {
			tDTOList.add(DTOMapper.fromTransactionModelToTransactionDTO(transactionModel));
		}
		return tDTOList;
	}

}
