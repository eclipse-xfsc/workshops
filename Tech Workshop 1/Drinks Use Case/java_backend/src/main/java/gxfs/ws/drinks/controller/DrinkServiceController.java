package gxfs.ws.drinks.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import eu.gaiax.difs.fc.api.generated.model.QueryLanguage;
import eu.gaiax.difs.fc.api.generated.model.Results;
import eu.gaiax.difs.fc.api.generated.model.SelfDescription;
import eu.gaiax.difs.fc.api.generated.model.Statement;
import eu.gaiax.difs.fc.client.QueryClient;
import eu.gaiax.difs.fc.client.SelfDescriptionClient;

/**
 * Users API Controller.
 */
@RestController
@RequestMapping("drinks")
public class DrinkServiceController {

  @Autowired
  private QueryClient queryClient;
  @Autowired
  private SelfDescriptionClient sdClient;

  @GetMapping("/{drinkId}")
  public SelfDescription getDrinkDescription(@PathVariable("drinkId") String drinkId) {
	List<SelfDescription> drinks = sdClient.getSelfDescriptions(null, null, null, null, null, drinkId, null);
    return drinks.isEmpty() ? null : drinks.get(0);
  }

  @GetMapping
  public List<SelfDescription> getDrinkDescriptions(@RequestParam("issuer") String issuer) {
    return sdClient.getSelfDescriptions(null, null, issuer, null, null, null, null);
  }

  @GetMapping("/query")
  public List<SelfDescription> queryDrinkDescriptions(@RequestParam("strength") Integer strength) {
	Statement stmt = new Statement();
	stmt.setStatement("match (d:Drink) where (d.abv < $strength) return d.uri");
	stmt.setParameters(Map.of("strength", strength));
	Results result = queryClient.query(QueryLanguage.OPENCYPHER, null, false, stmt);  
	List<String> ids = result.getItems().stream().map(m -> m.get("uri").toString()).collect(Collectors.toList());
	// fix SD client to accept list of SD ids!
	List<SelfDescription> drinks = new ArrayList<>(ids.size());
	ids.forEach(id -> drinks.add(getDrinkDescription(id)));
    return drinks;
  }


}
